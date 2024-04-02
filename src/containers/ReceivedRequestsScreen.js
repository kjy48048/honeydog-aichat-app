import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useUser} from '../components/provider/UserProvider';
import FriendService from '../services/api/FriendService';
import {useIsFocused} from '@react-navigation/native'; // isFocused를 사용하기 위해 추가

const ReceivedRequestsScreen = ({navigation}) => {
  const [isLoading, setLoading] = useState(true);
  const [friends, setFriends] = useState([]);
  const {user} = useUser();
  const isFocused = useIsFocused(); // 화면 포커스 상태

  const handleAcceptFriend = (friendEmail) => {
    console.log(`친구 요청 수락: ${friendEmail}`);
    saveFriend(friendEmail, 'ACCEPTED');
  };

  const handleRejectFriend = (friendEmail) => {
    console.log(`친구 요청 거절: ${friendEmail}`);
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
        apiType: 'findReverseFriendList',
        userUuid: user.userUuid,
        friendStatus: 'REQUESTED',
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
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : friends.length > 0 ? (
        <FlatList
          data={friends}
          keyExtractor={item => item.email}
          renderItem={({item}) => (
            <View style={styles.listItem}>
              <Image
                source={{uri: item.picture}}
                style={styles.profileImage}
              />
              <Text style={styles.name}>{item.nick}</Text>
              <TouchableOpacity
                style={styles.checkIcon}
                onPress={() => handleAcceptFriend(item.email)}>
                <Text style={styles.checkText}>✓</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelIcon}
                onPress={() => handleRejectFriend(item.email)}>
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
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  name: {
    flex: 1,
  },
  checkIcon: {
    marginRight: 10,
    padding: 5,
    backgroundColor: 'green',
    borderRadius: 5,
  },
  checkText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  cancelIcon: {
    marginRight: 10,
    padding: 5,
    backgroundColor: '#FF0000',
    borderRadius: 5,
  },
  cancelText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },

  noResultsText: {
    marginTop: 20,
    marginLeft: 20,
  },
});

export default ReceivedRequestsScreen;
