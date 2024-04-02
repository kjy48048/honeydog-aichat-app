/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import {Keyboard} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import {Client} from '@stomp/stompjs';
import {WS_URL} from '@env';
import {useUser} from '../components/provider/UserProvider';
import FriendListModal from '../components/FriendListModal';
import ChatHistoryService from '../services/api/ChatHistoryService';
import ChatRoomManageService from '../services/api/ChatRoomManageService';
import FriendService from '../services/api/FriendService';

const ChatScreen = ({route}) => {
  const [messages, setMessages] = useState([]); // 채팅 메시지 목록
  const [inputMessage, setInputMessage] = useState(''); // 입력한 채팅 메시지
  const {roomUuid, roomNick, aiUserUuid, roomType} = route.params || {};
  const [chatType, setChatType] = roomType === 'AI' ? useState('AI_TALK') : useState('TALK'); // 초기 대화 유형을 TALK로 설정
  const [inputHeight, setInputHeight] = useState(40); // 초기 TextInput 높이 설정
  const PAGE_SIZE = 20; // 한 번에 불러올 메시지 수
  const [page, setPage] = useState(0); // 현재 페이지
  const [refreshing, setRefreshing] = useState(false); // 새로고침 중인지 아닌지를 나타내는 상태
  const [isAtBottom, setIsAtBottom] = useState(true); // 스크롤이 맨 아래에 있는지 여부를 추적하는 상태
  const [isCreateModalVisible, setCreateModalVisible] = useState(false); // 유저 초대 모달 표시 여부
  const [friendList, setFriendList] = useState([]); // 초대가능한 친구목록

  const chatTitle = roomNick ? roomNick : '새로운 채팅창';
  let wsUrl = WS_URL;
  const defaultImageUri =
    ''; // 기본 이미지 URL 추가

  const reconnect = useRef(0); // 소캣 재연결횟수
  const headers = {};

  const stompClient = useRef({});
  const flatListRef = useRef();
  const {user} = useUser();

  // 웹소켓 연결
  const connect = () => {
    console.log('=== connect ===');

    stompClient.current = new Client({
      brokerURL: wsUrl,
      connectHeaders: headers ? headers : {},
      // connectHeaders: {
      //   login: 'user',
      //   passcode: 'password',
      // },
      debug: function (str) {
        console.log('STOMP DEBUG: ' + str);
      },
      onConnect: () => {
        console.log('=== onConnect ===');
        subscribe();
        sendWcMessage();
      },
      onDisconnect: () => {
        console.log('=== onDisconnect ===');
      },
      onStompError: frame => {
        console.log('=== onStompError ===');
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
      reconnectDelay: 5000, //자동 재 연결
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      forceBinaryWSFrames: true,
      appendMissingNULLonIncoming: true,
    });

    stompClient.current.activate();
    return stompClient.current;
  };

  // 웹소켓 구독
  const subscribe = () => {
    console.log('=== subscribe ===');
    stompClient.current.subscribe('/topic/chat/room/' + roomUuid, message => {
      const recv = message.body;
      // 구독한 메세지, 받을 때 처리...
      recvMessage(recv);
    });
  };

  // 환영메세지
  const sendWcMessage = () => {
    console.log('=== sendWcMessage ===');
    if (!stompClient.current.connected) {
      console.log(`stompClient unConnected: ${stompClient.current.connected}`);
      return; // 연결 안되면 보내지 않음
    }
    const wcMessage = {
      messageType: 'ENTER',
      nick: `${user.nick}`,
      roomUuid: `${roomUuid}`, // 방 uuid
    };

    console.log(`sendWcMessage checkType: ${typeof JSON.stringify(wcMessage)}`);

    stompClient.current.publish({
      destination: '/app/chat/v2/message',
      body: JSON.stringify(wcMessage),
    });
  };

  // 메세지 보내기
  const sendMessage = () => {
    console.log('=== sendMessage ===');
    if (!stompClient.current.connected) {
      console.log(`stompClient unConnected: ${stompClient.current.connected}`);
      return; // 연결 안되면 보내지 않음
    }
    if (inputMessage.trim() === '') {
      console.log(`inputMessage is empty.`);
      return; // 빈 메시지는 추가하지 않음
    }
    console.log(`inputMessage: ${inputMessage}`);
    const message = {
      messageType: `${chatType}`,
      aiUserUuid: `${aiUserUuid}`,
      message: `${inputMessage}`,
      nick: `${user.nick}`,
      userUuid: `${user.userUuid}`,
      roomUuid: `${roomUuid}`, // 방 uuid
    };

    stompClient.current.publish({
      destination: '/app/chat/v2/message',
      body: JSON.stringify(message),
    });
    setInputMessage(''); // 입력 필드 초기화
    // 키보드 내리기
    Keyboard.dismiss();
  };

  // 기존 채팅 목록 가져오기...
  const getChatHistory = async (page) => {
    console.log('=== getChatHistory ===');
    const data = await ChatHistoryService({
      apiType: 'findAppChatList',
      roomUuid: roomUuid,
      page: page,
      pageSize: PAGE_SIZE,
    });

    if (!Array.isArray(data)) {
      // data가 배열이 아닌 경우
      console.log('=== getChatHistory data가 배열이 아닌 경우 함수 종료 ===');
      return; // 함수 종료
    }

    const newMessages = data.map((recv, index) => {
      console.log(`메시지 #${index + 1} 처리 중...`, recv);
      return {
        text: recv.message,
        nick: recv.nick,
        picture: recv.picture,
        isMine: user.userUuid === recv.userUuid,
        isEnter: recv.messageType === 'ENTER',
        timestamp: recv.messageType === 'ENTER' ? '' : recv.formattedCreatedDate,
      };
    });

    setMessages(prevMessages => [...newMessages.reverse(), ...prevMessages]);
  };

  // Stomp 콜백함수...: 채팅화면에 메시지 추가
  const recvMessage = recv => {
    console.log('=== recvMessage ===');

    if (!recv) {
      // 데이터가 없는 경우 리턴
      console.log('=== recvMessage data가 없는 경우 함수 종료 ===');
      return;
    }

    // JSON 문자열을 객체로 변환
    const data = JSON.parse(recv);

    const newMessage = {
      text: data.message,
      nickName: data.nick,
      picture: data.picture,
      isMine: user.userUuid === data.userUuid,
      isEnter: data.messageType === 'ENTER',
      timestamp: data.messageType === 'ENTER' ? '' : data.formattedCreatedDate, // 시간
    };

    setMessages(prevMessages => {
      // 새 메시지를 상태에 추가
      const newMessages = [...prevMessages, newMessage];
      return newMessages;
    });
  };

  // 대화 유형 변경 함수
  const toggleChatType = () => {
    setChatType(current =>
      current === 'AI_TALK' ? 'TALK' : 'AI_TALK',
    );
  };

  // 채팅창 높이조정
  const handleContentSizeChange = (event) => {
    setInputHeight(event.nativeEvent.contentSize.height); // 입력 내용에 따라 높이 조정
  };

  // FlatList의 refresh 이벤트 핸들러
  const handleRefresh = () => {
    setRefreshing(true);
    console.log(`=== handleRefresh ===`);
    console.log(`=== page: ${page} ===`);
    setPage(prevPage => prevPage + 1);
      getChatHistory(page).then(() => {
      setRefreshing(false);
    });
  };

  // 스크롤 이벤트 핸들러
  const handleScroll = (event) => {
    const y = event.nativeEvent.contentOffset.y;
    const height = event.nativeEvent.layoutMeasurement.height;
    const contentHeight = event.nativeEvent.contentSize.height;
    // 스크롤이 맨 아래에 있는지 여부를 업데이트
    setIsAtBottom(y + height >= contentHeight);
  };

  // 친구 초대관련
  // 친구 목록 가져오기...
  const findFriendList = async () => {
    if (!user) return setFriendList([]);

    try {
      const data = await FriendService({
        apiType: 'findInterFriendListByUserNotInRoom',
        userUuid: user.userUuid,
        roomUuid: roomUuid,
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

  // 초대하기
  const inviteUser = async (item) => {
    console.log('=== inviteUser ===');

    // 초대메세지
    const sendInviteMessage = (message) => {
      console.log('=== sendInviteMessage ===');
      if (!stompClient.current.connected) {
        console.log(`stompClient unConnected: ${stompClient.current.connected}`);
        return; // 연결 안되면 보내지 않음
      }
      const inviteMessage = {
        messageType: 'SYSTEM',
        nick: `${user.nick}`,
        roomUuid: `${roomUuid}`, // 방 uuid
        messages: `${message}`
      };

      console.log(`inviteMessage checkType: ${typeof JSON.stringify(inviteMessage)}`);

      stompClient.current.publish({
        destination: '/app/chat/v2/message',
        body: JSON.stringify(inviteMessage),
      });
    };

    try {
      const data = await ChatRoomManageService({
        apiType: 'invite',
        userUuid: user.userUuid,
        roomUuid: roomUuid,
        inviteUserEmail: item.email,
      });
      if (data) {
        console.log(`inviteUser success: ${data.JSON.stringify}`);
        sendInviteMessage(`${item.nick}님을 초대하였습니다.`);
      } else {
        console.log('inviteUser fail');
        sendInviteMessage(`${item.nick}님 초대에 실패하였습니다.`);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    // 구독처리...
    console.log('=== useEffect ===');
    connect();
    getChatHistory(page);
    findFriendList();

    return () => stompClient.current.deactivate();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{chatTitle}</Text>
      </View>
      <TouchableOpacity onPress={() => setCreateModalVisible(true)}>
        <Ionicons
          name="add-circle-outline"
          size={20}
          style={styles.addButton}
        />
      </TouchableOpacity>
      <FlatList
        ref={flatListRef}
        onScroll={handleScroll}
        onContentSizeChange={() => {
          if (isAtBottom) {
            flatListRef.current?.scrollToEnd({animated: true});
          }
        }}
        onRefresh={handleRefresh} // 리스트를 아래로 당겨 새로고침할 때 호출될 함수 지정
        refreshing={refreshing} // 현재 새로고침 중인지 아닌지를 나타내는 상태
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <View
            style={{
              alignItems: item.isEnter
                ? 'center'
                : item.isMine
                ? 'flex-end'
                : 'flex-start',
            }}>
            {!item.isEnter && !item.isMine && (
              <View style={styles.profileContainer}>
                <Image
                  source={{uri: item.picture || `${defaultImageUri}`}} // 기본 이미지 URL을 추가하세요.
                  style={styles.profileImage}
                />
                <Text style={styles.nickName}>{item.nick}</Text>
              </View>
            )}
            <View
              style={[
                item.isEnter
                  ? styles.systemMessage
                  : item.isMine
                  ? styles.myMessage
                  : styles.otherMessage,
              ]}>
              <Text
                style={[item.isEnter ? styles.systemText : styles.messageText]}>
                {item.text}
              </Text>
            </View>
            {!item.isEnter && (
              <View
                style={[
                  styles.timestampContainer,
                  item.isMine
                    ? {justifyContent: 'flex-end'}
                    : {justifyContent: 'flex-start'},
                ]}>
                <Text style={styles.timestamp}>{item.timestamp}</Text>
              </View>
            )}
          </View>
        )}
      />

      <View style={styles.inputContainer}>
        {roomType === 'ALL' && (<TouchableOpacity onPress={toggleChatType} style={styles.toggleButton}>
          <Text style={styles.buttonText}>{chatType}</Text>
        </TouchableOpacity>)}
        <TextInput
          style={[styles.input, { height: Math.max(40, inputHeight) }]}
          placeholder="메시지를 입력하세요..."
          value={inputMessage}
          onChangeText={text => setInputMessage(text)}
          multiline={true} // 여러 줄 입력 활성화
          onContentSizeChange={handleContentSizeChange}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>전송</Text>
        </TouchableOpacity>
      </View>
      {/* 채팅방 생성 모달 */}
      <FriendListModal
        titleText='초대하기'
        isVisible= {isCreateModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onPressFriend={inviteUser}
        onPressAI={''}
        friendList={friendList}
        aiList={''}
        friendType='AI'
        mode='friendsOnly'
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  myMessage: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // 오른쪽 정렬
    backgroundColor: '#FFD700', // 노란색 바탕
    padding: 10,
    margin: 5,
    borderRadius: 10,
    maxWidth: '70%', // 화면의 절반 크기
    alignSelf: 'flex-end', // 오른쪽 정렬을 위해
  },
  otherMessage: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // 왼쪽 정렬
    backgroundColor: '#99CCFF', // 흰색 바탕
    padding: 10,
    margin: 5,
    borderRadius: 10,
    maxWidth: '70%', // 화면의 절반 크기
    alignSelf: 'flex-start', // 왼쪽 정렬을 위해
  },
  systemMessage: {
    justifyContent: 'center', // 중앙 정렬
    alignItems: 'center',
    backgroundColor: '#CCCCCC', // 회색 바탕
    padding: 5,
    margin: 5,
    borderRadius: 10,
    maxWidth: '70%', // 화면의 절반 크기
    alignSelf: 'center', // 중앙 정렬을 위해
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5, // 닉네임과 프로필 이미지 사이 간격
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 15,
    marginRight: 8, // 프로필 이미지와 닉네임 사이 간격
  },
  nickName: {
    fontWeight: 'bold',
    color: '#555', // 닉네임 텍스트 색상
  },
  timestampContainer: {
    flexDirection: 'row',
    paddingRight: 10,
    paddingLeft: 10, // 왼쪽 메시지에 대해 날짜 왼쪽 정렬을 위한 패딩
    marginBottom: 5,
  },
  messageBubble: {
    borderRadius: 16,
    backgroundColor: '#FFD700', // 노란색 백그라운드
    padding: 12,
  },
  messageText: {
    color: '#000000',
    marginBottom: 5, // 시간이 밑줄에 표시되도록 여백 추가
  },
  systemText: {
    color: '#FFFFFF',
  },
  timestampContainer: {
    alignItems: 'flex-end', // 시간을 오른쪽에 배치
    paddingRight: 10, // 패딩을 주어 시간과 메시지 간 간격을 조정
    marginBottom: 5, // 메시지 아래에 여백을 추가
  },
  timestamp: {
    fontSize: 12,
    color: '#999999',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  toggleButton: {
    marginRight: 10,
    backgroundColor: '#e0e0e0',
    padding: 10,
    justifyContent: 'center', // 중앙 정렬
  },
  input: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingLeft: 16,
  },
  sendButton: {
    marginLeft: 8,
    padding: 8,
    backgroundColor: '#007BFF', // 파란색 백그라운드
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#FFFFFF',
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

export default ChatScreen;
