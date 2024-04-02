import React, {useState, useEffect} from 'react';
import {Alert, View, ScrollView, RefreshControl, StyleSheet} from 'react-native';
import {useIsFocused, useNavigation} from '@react-navigation/native'; // isFocused를 사용하기 위해 추가
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useUser} from '../components/provider/UserProvider';

import FriendService from '../services/api/FriendService';
import UserService from '../services/api/UserService';
import RoomService from '../services/api/RoomService';
import RecommendService from '../services/api/RecommendService';
import StorageService from '../services/service/StorageService';

import AIFriendSection from './sections/home/AIFriendSection';
import FriendsSection from './sections/home/FriendsSection';
import GoogleBannerAdSection from './sections/home/GoogleBannerAdSection';
import MyProfileSection from './sections/home/MyProfileSection';
import RecommendedQuestionsSection from './sections/home/RecommendedQuestionsSection';
import TitleChangeModal from '../components/TitleChangeModal';

import {GOOGLE_WEB_CLIENT_ID} from '@env';

const HomeScreen = () => {
  const navigation = useNavigation();
  const {user, updateUser} = useUser();
  const [friends, setFriends] = useState([]);
  const [aiFriends, setAiFriends] = useState([]);
  const [recommends, setRecommends] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false); // 모달 표시 여부
  const [promptText, setPromptText] = useState(''); // 입력된 텍스트
  const [titleText, setTitleText] = useState(''); // 입력된 텍스트
  const [modalApiType, setModalApiType] = useState(''); // 입력된 텍스트
  const isFocused = useIsFocused(); // 화면 포커스 상태

  // -- 로그인 관련 시작 -- //
  const checkUser = async () => {
    // 로그인했는지 확인
    // 로그아웃하면 로그인 화면으로 이동처리
    if (!user) {
      navigation.navigate('LoginScreen');
    }
  };

  const configureGoogleSignIn = () => {
    console.log('=== configureGoogleSignIn ===');
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
      offlineAccess: true,
    });
  };
  // -- 로그인 관련 끝 -- //

  // -- 친구 관련 시작 -- //
  const findFriendList = async (forceUpdate = false) => {
    if (!user) return setFriends([]);

    let friendsData = forceUpdate ? null : await StorageService({svcType: 'retrieveFriends'});

    if (friendsData) {
      // JSON 문자열을 객체 배열로 변환
      friendsData = JSON.parse(friendsData);
      setFriends(friendsData);
    } else {
      try {
        const data = await FriendService({
          apiType: 'findFriendList',
          userUuid: user.userUuid,
          friendStatus: 'ACCEPTED',
          friendType: 'HUMAN',
        });
        if (data) {
          setFriends(data);
          await StorageService({
            svcType: 'saveFriends',
            aiFriends: JSON.stringify(data) // 객체 배열을 JSON 문자열로 변환하여 저장
          });
        } else {
          setFriends([]);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const findAllAiUser = async (forceUpdate = false) => {
    let aiFriendsData = forceUpdate ? null : await StorageService({svcType: 'retrieveAiFriends'});

    // 로컬 스토리지에서 AI 친구 목록을 불러오기 시도
    if (aiFriendsData) {
      // JSON 문자열을 객체 배열로 변환
      aiFriendsData = JSON.parse(aiFriendsData);
      setAiFriends(aiFriendsData);
    } else {
      // 서버에서 AI 친구 목록 가져오기
      try {
        const data = await UserService({
          apiType: 'findAllAiUser',
          userUuid: user.userUuid,
        });
        if (data) {
          setAiFriends(data);
          // 로컬 스토리지에 AI 친구 목록 저장
          await StorageService({
            svcType: 'saveAiFriends',
            aiFriends: JSON.stringify(data) // 객체 배열을 JSON 문자열로 변환하여 저장
          });
        } else {
          setAiFriends([]);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  // -- 친구 관련 끝 -- //

  // 추천질문목록 가져오기
  // -- 친구 관련 시작 -- //
  const findRecommendList = async (forceUpdate = false) => {
    if (!user) return setRecommends([]);

    let recommendsData = forceUpdate ? null : await StorageService({svcType: 'retrieveRecommends'});

    if (recommendsData) {
      // JSON 문자열을 객체 배열로 변환
      recommendsData = JSON.parse(recommendsData);
      setRecommends(recommendsData.body);
    } else {
      try {
        const data = await RecommendService({
          apiType: 'findAll',
        });
        if (data) {
          setRecommends(data.body);
          await StorageService({
            svcType: 'saveRecommends',
            aiFriends: JSON.stringify(data) // 객체 배열을 JSON 문자열로 변환하여 저장
          });
        } else {
          setRecommends([]);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const onEditQuestion = () => {
    console.log('onEditQuestion');
  };

  // -- 채팅방 만들기 관련 시작 -- //
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
      console.log(`createRoom Success!! roomUuid: ${data.roomUuid}, roomNick: ${data.roomNick}, aiUserUuid:${aiUserUuid}, roomType:${data.roomType}`);
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

  // -- 프로필영역 닉네임, 인사말 변경 시작 -- //
  const handleEditNickName = userNick => {
    console.log('handleEditNickName');
    setPromptText(userNick); // 입력 필드 초기화
    setTitleText('닉네임 변경하기');
    setModalApiType('updateNick');
    setModalVisible(true); // 모달 표시
  };

  const handleEditGreeting = greetings => {
    console.log('handleEditGreeting');
    setPromptText(greetings); // 입력 필드 초기화
    setTitleText('인사말 변경하기');
    setModalApiType('updateGreetings');
    setModalVisible(true); // 모달 표시
  };

  // 제목변경 실행
  const handleModalSubmit = text => {
    // 모달에서 입력한 텍스트를 사용하여 제목 변경 로직 수행
    console.log('Modal Text:', text);
    console.log('Modal apiType:', modalApiType);

    let nick, picture, greetings;

    if (modalApiType === 'updateNick') {
      nick = text;
    } else if (modalApiType === 'updatePicture') {
      picture = text;
    } else if (modalApiType === 'updateGreetings') {
      greetings = text;
    }

    // 제목변경 API호출
    const updateUserCall = async () => {
      const data = await UserService({
        apiType: modalApiType,
        userUuid: user.userUuid,
        nick: nick,
        picture: picture,
        greetings: greetings,
      });
      if (data !== null) {
        // data가 성공적으로 반환된 경우, 사용자 정보 업데이트
        if (modalApiType === 'updateNick') {
          updateUser({...user, nick: text});
        } else if (modalApiType === 'updatePicture') {
          updateUser({...user, picture: text});
        } else if (modalApiType === 'updateGreetings') {
          updateUser({...user, greetings: text});
        }
        console.log(data);
      } else {
        console.log('updateUser data is null');
      }
      // 수정 후에 채팅 목록 다시 불러오기
      setModalVisible(false); // 모달 닫기
    };
    updateUserCall();
  };

  // 유저 개별 프로필보기
  const onNavigateProfile = (selectedUser) => {
    navigation.navigate('UserProfileScreen', { selectedUser: selectedUser });
  }
  // -- 프로필영역 닉네임, 인사말 변경 끝 -- //

  const loadFriends = async (forceUpdate) => {
    findFriendList(forceUpdate);
    findAllAiUser(forceUpdate);
    findRecommendList(forceUpdate);
  };

  const onRefresh = React.useCallback(async () => {
    console.log("=== onRefresh ===");
    setRefreshing(true);
    await loadFriends(true); // 친구 목록을 새로 불러옵니다.
    setRefreshing(false);
  }, []);

  useEffect(() => {
    checkUser();
    configureGoogleSignIn();
    if (isFocused && user) {
      loadFriends(false);
    }
  }, [navigation, user, isFocused]);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ScrollView
        style={styles.container}
        refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
        }
      >
        <MyProfileSection
          user={user}
          // onLogout={handleLogout}
          onEditNickname={handleEditNickName}
          onEditGreeting={handleEditGreeting}
        />
        <RecommendedQuestionsSection recommends={recommends} onAiChat={onAiChat} onEditQuestion={onEditQuestion} />
        <GoogleBannerAdSection />
        <AIFriendSection aiFriends={aiFriends} onAiChat={onAiChat} onNavigateProfile={onNavigateProfile}/>
        <FriendsSection friends={friends} onChat={onChat} onNavigateProfile={onNavigateProfile} />
      </ScrollView>

      {/* 제목 변경 Modal 컴포넌트 */}
      <TitleChangeModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleModalSubmit}
        titleText={titleText}
        initialValue={promptText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5DEB3',
  },
});

export default HomeScreen;
