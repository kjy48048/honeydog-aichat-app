import React, {useState, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';

const FriendListModal = ({titleText,isVisible,onClose,onPressFriend,onPressAI,friendList,aiList,friendType,mode}) => {
  const [currentList, setCurrentList] = useState(aiList);
  const [currentType, setCurrentType] = useState(friendType);

  const defaultImageUri = ''; // 기본 이미지 URL 추가

  useEffect(() => {
    // 모드에 따라 초기 리스트 설정
    if (mode === 'both') {
      setCurrentList(friendType === 'AI' ? aiList : friendList);
    } else if (mode === 'friendsOnly') {
      setCurrentList(friendList);
    }
  }, [friendList, aiList, friendType, mode]);

  const handleSwitchButton = type => {
    console.log("=== handleSwitchButton ===");
    setCurrentList(type === 'AI' ? aiList : friendList);
    setCurrentType(type);
  };

  const handlePressItem = item => {
    console.log('=== handlePressItem ===');
    if(currentType === 'AI') {
        onPressAI(item);
    } else {
        onPressFriend(item);
    }
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}>
      <View style={styles.friendModalContent}>
        <View style={styles.friendModalTitle}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Ionicons name="arrow-back-outline" size={24} />
          </TouchableOpacity>
          <Text style={styles.friendModalTitleText}>{titleText}</Text>
          <View style={{ width: 24 }} />
        </View>
        {mode === 'both' && (
        <View style={styles.friendModalButton}>
            <TouchableOpacity
            style={styles.friendModalOptionButton}
            onPress={() => handleSwitchButton('AI')}>
            <Text style={styles.modalButtonText}>AI목록</Text>
            </TouchableOpacity>
            <TouchableOpacity
            style={styles.friendModalOptionButton}
            onPress={() => handleSwitchButton('Friend')}>
            <Text style={styles.modalButtonText}>친구목록</Text>
            </TouchableOpacity>
        </View>
        )}
        <FlatList
          data={currentList}
          keyExtractor={(item, index) => index}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => handlePressItem(item)}>
              <Image
                source={{uri: item.picture || defaultImageUri}}
                style={styles.profileImage}
              />
              <Text style={styles.nickName}>{item.nick}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>조회된 목록이 없습니다.</Text>
            </View>
          )}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  friendModalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    position: 'absolute',
    top: '30%',
    left: '10%',
    right: '10%',
  },
  friendModalTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  friendModalTitleText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  nickName: {
    fontSize: 16,
  },

  modalButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },

  friendModalButton: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  friendModalOptionButton: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    padding: 10,
    flex: 1,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    marginLeft: -10,
  },

  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999999',
  },
});

export default FriendListModal;
