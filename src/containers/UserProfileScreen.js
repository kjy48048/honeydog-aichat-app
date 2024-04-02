import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Alert, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useUser} from '../components/provider/UserProvider';
import RoomService from '../services/api/RoomService';

const UserProfileScreen = ({ route, navigation }) => {
  const { selectedUser } = route.params;
  const { user } = useUser();
  const defaultImageUri = '';

  // -- 채팅방 만들기 관련 시작 -- //
  const onChatStart = (selectedUser) => {
    if(selectedUser.isAI) {
      onAiChat(selectedUser.userUuid, selectedUser.nick);
    } else {
      onChat(selectedUser.email, selectedUser.nick);
    }
  }

  const onAiChat = (aiUserUuid, nick) => {
    console.log(`onAiChat Start! aiUserUuid: ${aiUserUuid}`);
    const roomNick = `${nick}`;

    const createRoom = async () => {
      const data = await RoomService({
        apiType: 'save',
        roomNick: roomNick,
        userUuid: user.userUuid,
        aiUserUuid: aiUserUuid,
        roomStatus: 'OPEN',
        roomType: 'AI',
      });
      if (!data) {
        // data가 undefined인 경우
        console.log('data is null...');
        Alert.alert('오류가 발생하였습니다.');
        return;
      }
      console.log(`createRoom Success!! data: ${data}`);
      return enterRoom(data, aiUserUuid); // 함수 종료
    };

    createRoom();
  };

  const onChat = (email, nick) => {
    console.log(`onChat Start! Chatter: ${nick} Email: ${email}`);
    const roomNick = `${user.nick}, ${nick}`;

    const createRoom = async () => {
      const data = await RoomService({
        apiType: 'save',
        userUuid: user.userUuid,
        friendEmails: email,
        roomNick: roomNick,
        roomStatus: 'OPEN',
        roomType: 'FRIEND',
      });
      if (data === null) {
        // data가 undefined인 경우
        console.log('data is null...');
        Alert.alert('오류가 발생하였습니다.');
        return;
      }
      return enterRoom(data); // 함수 종료
    };

    createRoom();
  };

  // 채팅방 들어가기 로직
  const enterRoom = (data, aiUserUuid) => {
    console.log('=== enterRoom ===');
    navigation.navigate('ChatScreen', {
      roomUuid: data.roomUuid,
      roomNick: data.roomNick,
      aiUserUuid: aiUserUuid,
      roomType: data.roomType,
    });
  };
  // -- 채팅방 만들기 관련 끝 -- //

  // 컴포넌트를 조건부로 렌더링하는 함수
  const renderContent = () => (
    <View style={selectedUser.isAI ? styles.aiProfileContainer : styles.profileContainer}>
      {!selectedUser.isAI && (
        <Image
            source={{ uri: selectedUser.picture || defaultImageUri }}
            style={styles.profileImage}
        />
      )}
      <View style={styles.textBackground}>
        <Text style={styles.nick}>{selectedUser.nick}</Text>
        <Text style={styles.greetings}>{selectedUser.greetings || '안녕하세요 만나서 반갑습니다!'}</Text>
      </View>
      <TouchableOpacity style={styles.chatButton} onPress={() => onChatStart(selectedUser)}>
          <Ionicons name="chatbubble-ellipses-outline" size={20} color="#fff" />
          <Text style={styles.chatButtonText}>대화하기</Text>
      </TouchableOpacity>
    </View>
  );

  // 조건부로 ImageBackground 또는 View를 사용
  return selectedUser.isAI ? (
    <ImageBackground
      source={{ uri: selectedUser.picture || defaultImageUri }}
      style={styles.backgroundImage}
    >
      {renderContent()}
    </ImageBackground>
  ) : (
    renderContent()
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiProfileContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    position: 'absolute',
    bottom: '10%',
  },
  profileContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  textBackground: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  nick: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  greetings: {
    fontSize: 16,
    textAlign: 'center',
    color: '#000',
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  chatButtonText: {
    marginLeft: 10,
    color: '#fff',
    fontSize: 18,
  },
});

export default UserProfileScreen;
