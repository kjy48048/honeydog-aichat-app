import React, {useState, useEffect} from 'react';
import {
  Button,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import UserService from '../services/api/UserService';
import FriendService from '../services/api/FriendService';
import {useUser} from '../components/provider/UserProvider';
import {useIsFocused} from '@react-navigation/native';

const BlockedUsersScreen = ({navigation}) => {
  const [searchType, setSearchType] = useState('email'); // 초기 검색 유형을 이메일로 설정
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);

  const [isLoading, setLoading] = useState(true);
  const [friends, setFriends] = useState([]);
  const {user} = useUser();
  const isFocused = useIsFocused(); // 화면 포커스 상태

  // 검색 유형 변경 함수
  const toggleSearchType = () => {
    setSearchType(current => (current === 'email' ? 'nick' : 'email'));
  };

  const handleSearch = async () => {
    console.log('handleSearch start!');

    if (searchQuery.length < 2) {
      Alert.alert('최소 2글자 이상으로 검색해야 합니다.');
      return;
    }

    let data;

    if (searchType === 'nick') {
      console.log('Searching by nickname');
      data = await UserService({
        apiType: 'findUserByNickLikeNotMe',
        userUuid: user.userUuid,
        nick: searchQuery,
      });
    } else if (searchType === 'email') {
      console.log('Searching by email');
      data = await UserService({
        apiType: 'findUserByEmailLikeNotMe',
        userUuid: user.userUuid,
        email: searchQuery,
      });
    }

    if (data) {
      console.log(data);
      const updatedResults = data.map(item => ({
        ...item,
        isRequested: false,
      }));
      setResults(updatedResults);
    } else {
      console.log('No results found');
      setResults([]);
    }
  };

  const handleBlockedFriend = async friendEmail => {
    // 친구차단 버튼 클릭시 처리...
    console.log(`친구 차단: ${friendEmail}`);
    saveFriend(friendEmail, 'BLOCKED');
  };

  const handleBlockedCancelFriend = async friendEmail => {
    // 친구차단 버튼 클릭시 처리...
    console.log(`친구 차단 취소: ${friendEmail}`);
    saveFriend(friendEmail, 'NO_RELATION');
  };

  const saveFriend = async (friendEmail, friendStatus) => {
    // 친구추가요청 버튼 클릭시 처리...
    console.log(`친구관계 Friend email: ${friendEmail}, status: ${friendStatus}`);
    try {
      const data = await FriendService({
        apiType: 'save',
        userUuid: user.userUuid,
        friendStatus: friendStatus,
        friendEmail: friendEmail,
      });
      if (data) {
        // 성공시 조회 목록 업데이트
        findFriendList();
      } else {
        console.error(data);
        Alert.alert('처리 도중 오류가 발생하였습니다.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('처리 도중 오류가 발생하였습니다.');
    }
  };

  const findFriendList = async () => {
    try {
      const data = await FriendService({
        apiType: 'findFriendList',
        userUuid: user.userUuid,
        friendStatus: 'BLOCKED',
        friendType: 'HUMAN',
      });
      if (data) {
        setFriends(data);
      } else {
        setFriends([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      findFriendList();
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <Text style={styles.subTitle}>차단할 친구 검색</Text>
      <View style={styles.searchBar}>
        <TouchableOpacity
          onPress={toggleSearchType}
          style={styles.toggleButton}>
          <Text style={styles.buttonText}>검색 유형: {searchType}</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="여기를 터치하여 입력"
          onChangeText={setSearchQuery}
          value={searchQuery}
        />
        <Button title="검색" onPress={handleSearch} />
      </View>
      <FlatList
        data={results}
        keyExtractor={item => item.email}
        renderItem={({item}) => (
          <View style={styles.resultItem}>
            <Image source={{uri: item.picture}} style={styles.profileImage} />
            <View style={styles.textContainer}>
              <Text>{item.nick}</Text>
              <Text>{item.email}</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.addButton,
                item.isRequested && {backgroundColor: 'grey'},
              ]}
              onPress={() => handleBlockedFriend(item.email)}
              disabled={item.isRequested}>
              <Text style={styles.addButtonText}>
                {item.isRequested ? '요청완료' : '차단요청'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* 소제목과 구분선 추가 */}
      <Text style={styles.subTitle}>차단된 친구 목록</Text>
      <View style={styles.divider} />

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : friends.length > 0 ? (
        <FlatList
          data={friends}
          keyExtractor={item => item.email}
          renderItem={({item}) => (
            <View style={styles.listItem}>
              <Image
                source={{uri: item.friendUserPicture}}
                style={styles.profileImage}
              />
              <View style={styles.textContainer}>
                <Text style={styles.name}>{item.nick}</Text>
                <Text style={styles.name}>{item.email}</Text>
                {/* 차단 일자 표시 */}
                <Text style={styles.blockedDate}>
                  차단 일자: {item.formattedModifiedDate}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.cancelIcon}
                onPress={() => handleBlockedCancelFriend(item.email)}>
                <Text style={styles.cancelText}>X</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noResultsText}>조회된 목록이 없습니다.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 10,
    paddingLeft: 10,
  },
  toggleButton: {
    marginRight: 10,
    backgroundColor: '#e0e0e0',
    padding: 10,
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flexDirection: 'column',
    flex: 1,
  },

  // 친구차단버튼...
  userInfoContainer: {
    flex: 1,
    marginLeft: 10,
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    justifyContent: 'space-between',
  },

  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingVertical: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#cccccc',
    marginVertical: 10,
  },
  blockedDate: {
    fontSize: 14,
    color: '#666666',
  },

  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    justifyContent: 'space-between',
  },
  name: {
    flex: 1,
  },
  cancelIcon: {
    marginRight: 10,
    padding: 5,
    backgroundColor: '#FF0000',
    borderRadius: 5,
  },
  cancelText: {
    fontSize: 16,
    color: 'white', // 취소 텍스트를 빨간색으로 설정
    fontWeight: 'bold',
  },
  // 조회된 목록이 없을 때의 스타일을 추가
  noResultsText: {
    marginTop: 20, // 상단 여백 추가
    marginLeft: 20, // 왼쪽 여백 추가
  },
});

export default BlockedUsersScreen;
