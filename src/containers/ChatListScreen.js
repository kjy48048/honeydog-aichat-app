/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import BannerAdMob from '../components/BannerAdMob';
import ChatListItem from '../components/ChatListItem';
import TitleChangeModal from '../components/TitleChangeModal';
import FriendListModal from '../components/FriendListModal';
import {useUser} from '../components/provider/UserProvider';

import RoomService from '../services/api/RoomService';
import FriendService from '../services/api/FriendService';
import UserService from '../services/api/UserService';

const ChatListScreen = () => {
  // 채팅로비
  const [isLoading, setLoading] = useState(true);
  const [rooms, setRooms] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false); // 모달 표시 여부
  const [promptText, setPromptText] = useState(''); // 입력된 텍스트
  const [promptRoomUuid, setPromptRoomUuid] = useState(''); // 입력된 방 uuid
  const {user} = useUser();

  const [isCreateModalVisible, setCreateModalVisible] = useState(false); // 채팅방 생성 모달 표시 여부

  const [aiChatList, setAiChatList] = useState([]);
  const [friendList, setFriendList] = useState([]);

  const isFocused = useIsFocused(); // isFocused Define
  const navigation = useNavigation();
  
  const defaultImageUri =
    ''; // 기본 이미지 URL 추가

  const handleTitleChange = (roomUuid, roomNick) => {
    // 제목변경 로직 구현
    setPromptRoomUuid(roomUuid);
    setPromptText(roomNick); // 입력 필드 초기화
    setModalVisible(true); // 모달 표시
  };

  // 제목변경 실행
  const handleModalSubmit = text => {
    // 모달에서 입력한 텍스트를 사용하여 제목 변경 로직 수행
    console.log('Modal Text:', promptText);
    console.log('Modal Room:', promptRoomUuid);

    // 제목변경 API호출
    const updateNick = async () => {
      const data = await RoomService({
        apiType: 'updateNick',
        roomUuid: promptRoomUuid,
        userUuid: user.userUuid,
        roomNick: text,
      });
      if (data === null) {
        // data가 undefined인 경우
        return; // 함수 종료
      }
      //console.log(data);
      // 수정 후에 채팅 목록 다시 불러오기
      findJoinRooms();
      setModalVisible(false); // 모달 닫기
    };
    updateNick();
  };

  const handleDelete = (roomUuid, roomNick) => {
    // 삭제 로직 구현
    if (!roomNick) {
      roomNick = '새로운 채팅창';
    }
    createDeleteAlert(roomUuid, roomNick);
  };

  // 삭제 알림창
  const createDeleteAlert = (roomUuid, roomNick) =>
    Alert.alert(
      '채팅을 나가시겠습니까?',
      '확인버튼을 누르면 [' + roomNick + '] 채팅을 나가게됩니다.',
      [
        {
          text: '취소',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: '확인',
          onPress: () => {
            console.log('OK Pressed');
            const outRoom = async () => {
              const data = await RoomService({
                apiType: 'outRoom',
                roomUuid: roomUuid,
              });
              if (data === null) {
                // data가 undefined인 경우
                return; // 함수 종료
              }
              //console.log(data);
              // 삭제 후에 채팅 목록 다시 불러오기
              findJoinRooms();
            };
            outRoom();
          },
        },
      ],
    );

  // -- 채팅방 생성 관련 시작 -- //
  // 친구 목록 가져오기...
  const findFriendList = async () => {
    if (!user) return setFriendList([]);

    try {
      const data = await FriendService({
        apiType: 'findInterFriendListByUser',
        userUuid: user.userUuid,
      });
      if (data) {
        setFriendList(data);
      } else {
        setFriendList([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const findAllAiUser = async () => {
    try {
      const data = await UserService({
        apiType: 'findAllAiUser',
        userUuid: user.userUuid,
      });
      if (data) {
        setAiChatList(data);
      } else {
        setAiChatList([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 예제에 추가할 navigateToAiChatRoom 함수
  const navigateToAiChatRoom = item => {
    console.log('Navigating to ai chat room with', item.nick);
    // AI인지, 일반유저인지 구분해서 함수 실행....
    createAiChatRoom(item.userUuid, item.nick);
  };

  const navigateToChatRoom = item => {
    console.log('Navigating to chat room with', item.nick);
    // AI인지, 일반유저인지 구분해서 함수 실행....
    createChatRoom(item.nick, item.email);
  };

  // -- AI 채팅방 만들기 관련 시작 -- //
  const createAiChatRoom = (aiUserUuid, nick) => {
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
      if (data === null) {
        // data가 undefined인 경우
        console.log('data is null...');
        Alert.alert('오류가 발생하였습니다.');
        setCreateModalVisible(false); // 채팅방 생성 모달 닫기
        return;
      }
      setCreateModalVisible(false); // 채팅방 생성 모달 닫기
      return enterRoom(data); // 함수 종료
    };

    createRoom();
  };

  // -- 채팅방 만들기 관련 시작 -- //
  const createChatRoom = (nick, email) => {
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
        setCreateModalVisible(false); // 채팅방 생성 모달 닫기
        return;
      }
      setCreateModalVisible(false); // 채팅방 생성 모달 닫기
      return enterRoom(data); // 함수 종료
    };

    createRoom();
  };

  // -- 채팅방 생성 관련 끝 -- //

  // 채팅방 들어가기 로직
  const enterRoom = (data) => {
    navigation.navigate('ChatScreen', {
      roomUuid: data.roomUuid,
      roomNick: data.roomNick,
      aiUserUuid: data.aiUserUuid,
      roomType: data.roomType,
    });
  };

  // 채팅 목록 가져오기...
  const findJoinRooms = async () => {
    const data = await RoomService({
      apiType: 'findJoinRooms',
      userUuid: user.userUuid,
    });
    if (data === null) {
      // data가 undefined인 경우
      return; // 함수 종료
    }
    //console.log(data);

    setRooms(data);
    setLoading(false);
  };

  useEffect(() => {
    // 채팅창 목록 가져오기 구현
    console.log('=== useEffect ===');
    findJoinRooms();
    findFriendList();
    findAllAiUser();
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <View style={{flex: 1}}>
          <BannerAdMob />
          <TouchableOpacity onPress={() => setCreateModalVisible(true)}>
            <Ionicons
              name="add-circle-outline"
              size={20}
              style={styles.addButton}
            />
          </TouchableOpacity>
          <FlatList
            data={rooms}
            keyExtractor={item => item.roomUuid}
            renderItem={({item}) => (
              <ChatListItem
                item={item}
                onPressTitleChange={() =>
                  handleTitleChange(item.roomUuid, item.roomNick)
                }
                onPressDelete={() => handleDelete(item.roomUuid, item.roomNick)}
                onPressTitle={() =>
                  enterRoom(item)
                }
              />
            )}
          />
        </View>
      )}

      {/* 제목 변경 Modal 컴포넌트 */}
      <TitleChangeModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleModalSubmit}
        titleText={'채팅방 변경하기'}
        initialValue={promptText}
      />

      {/* 채팅방 생성 모달 */}
      <FriendListModal
        titleText='새로운 채팅창 만들기'
        isVisible= {isCreateModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onPressFriend={navigateToChatRoom}
        onPressAI={navigateToAiChatRoom}
        friendList={friendList}
        aiList={aiChatList}
        friendType='Friend'
        mode='both'
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5DEB3', // 따뜻한 베이지색 배경 적용
  },
  roomList: {
    backgroundColor: '#cecece',
    alignItems: 'center',
    padding: 5,
    width: '100%',
    marginTop: 5,
  },
  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 35,
    height: 20,
    position: 'relative',
    alignSelf: 'flex-end',
    marginRight: 10,
    marginBottom: 10,
  },
});

export default ChatListScreen;
