import {GoogleSignin} from '@react-native-google-signin/google-signin';
import React, {useState} from 'react';
import {Text, View, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import BannerAdMob from '../components/BannerAdMob';
import {useUser} from '../components/provider/UserProvider';

import UserService from '../services/api/UserService';
import LoginService from '../services/api/LoginService';
import StorageService from '../services/service/StorageService';

const SettingScreen = ({navigation}) => {
  const [showFriendsManagement, setShowFriendsManagement] = useState(false);
  const [showUserInfoManagement, setShowUserInfoManagement] = useState(false);
  const {user, userOut} = useUser();

  const navigateToScreen = screenName => {
    navigation.navigate(screenName);
  };

  const handleLogout = async () => {
    // 제목변경 API호출
    try {
      const data = await LoginService({apiType: 'out', user: user});
      if (data && data.code === '200') {
        // 로그아웃 성공 여부 확인
        StorageService({svcType: 'clear'}); // 저장소에 데이터 제거
        handleGoogleSignOut(); // 구글 로그아웃 처리
        userOut(); // 훅에서 유저 제거
        console.log('Sign-Out success');
      } else {
        console.log(`Sign-Out fail: ${JSON.stringify(data)}`);
        errorAlert('로그아웃에 실패하였습니다.'); // 로그아웃 실패 알림
      }
    } catch (error) {
      console.log(`Sign-Out error: ${error}`);
      errorAlert('로그아웃에 실패하였습니다.'); // 로그아웃 실패 알림
    }
  };

  const handleGoogleSignOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    } catch (error) {
      console.error('handleGoogleSignOut Google Sign-Out error:', error);
    }
  };

  // 계정 삭제 버튼 클릭시
  const handleWithdraw = () => {
    console.log("=== handleWithdraw ===");

    Alert.alert(
      '계정을 삭제하시겠습니까?',
      '확인버튼을 누르면 계정이 삭제됩니다.',
      [
        {
          text: '취소',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: '확인',
          onPress: () => {
            withdrawUser();
          },
        },
      ],
    );
  }

  // 계정 삭제처리
  const withdrawUser = async () => {
    console.log("=== withdrawUser ===");
    try {
      const data = await UserService({apiType: 'withdrawUser', userUuid: user.userUuid});
      if (data) {
        // 탈퇴 성공 여부 확인
        StorageService({svcType: 'clear'}); // 저장소에 데이터 제거
        handleGoogleSignOut(); // 구글 로그아웃 처리
        userOut(); // 훅에서 유저 제거
        console.log('withdraw success');
      } else {
        console.log(`withdraw fail: ${JSON.stringify(data)}`);
        errorAlert('계정 삭제에 실패하였습니다.'); // 탈퇴 실패 알림
      }
    } catch (error) {
      console.log(`withdraw error: ${error}`);
      errorAlert("계정 삭제에 실패하였습니다."); // 탈퇴 알림
    }
  }

  // 로그아웃 실패 알림창
  const errorAlert = (errorMessage) => Alert.alert(errorMessage);

  return (
    <View style={styles.container}>
      <BannerAdMob />
      <TouchableOpacity
        style={styles.mainMenuItem}
        onPress={() => setShowUserInfoManagement(!showUserInfoManagement)}>
        <Text style={styles.mainMenuText}>내 정보 관리</Text>
      </TouchableOpacity>
      {showUserInfoManagement && (
        <>
          <TouchableOpacity
            style={styles.subMenuItem}
            onPress={() => handleLogout()}>
            <Text>로그아웃</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.subMenuItem}
            onPress={() => handleWithdraw()}>
            <Text>계정삭제</Text>
          </TouchableOpacity>
        </>
      )}
      <TouchableOpacity
        style={styles.mainMenuItem}
        onPress={() => setShowFriendsManagement(!showFriendsManagement)}>
        <Text style={styles.mainMenuText}>친구 관리</Text>
      </TouchableOpacity>
      {showFriendsManagement && (
        <>
          <TouchableOpacity
            style={styles.subMenuItem}
            onPress={() => navigateToScreen('FriendsListScreen')}>
            <Text>내 친구 목록</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.subMenuItem}
            onPress={() => navigateToScreen('SearchFriendsScreen')}>
            <Text>친구 찾기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.subMenuItem}
            onPress={() => navigateToScreen('ReceivedRequestsScreen')}>
            <Text>받은 친구 신청</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.subMenuItem}
            onPress={() => navigateToScreen('BlockedUsersScreen')}>
            <Text>내 차단 목록</Text>
          </TouchableOpacity>
        </>
      )}
      <TouchableOpacity
        style={styles.mainMenuItem}
        onPress={() => navigateToScreen('AIFriendsManagementScreen')}>
        <Text style={styles.mainMenuText}>AI 친구 관리</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.mainMenuItem}
        onPress={() => navigateToScreen('PostsScreen')}>
        <Text style={styles.mainMenuText}>문의하기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    padding: 20,
    backgroundColor: '#F5DEB3',
  },
  mainMenuItem: {
    width: '100%',
    padding: 10,
    marginTop: 5,
    backgroundColor: '#d2b48c',
    borderRadius: 5,
  },
  mainMenuText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subMenuItem: {
    alignSelf: 'stretch',
    padding: 10,
    marginTop: 5,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: '#F5DEB3',
    borderRadius: 5,
  },
});

export default SettingScreen;
