/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {GoogleSignin, GoogleSigninButton} from '@react-native-google-signin/google-signin';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Alert, View, Image, ImageBackground} from 'react-native';
import {useUser} from '../components/provider/UserProvider';
import LoginService from '../services/api/LoginService';
import OAuth2Service from '../services/api/OAuth2Service';
import StorageService from '../services/service/StorageService';
import {GOOGLE_WEB_CLIENT_ID} from '@env';
import honeydogaichat_icon from '../../assets/images/honeydogaichat_icon.png'
import backgroundImage from '../../assets/images/background2.webp'

const LoginScreen = ({navigation}) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // 헤더 전체를 숨깁니다
    });
  }, [navigation]);
  // 로그인
  const {userIn, userOut} = useUser();
  const [isSigningIn, setSigningIn] = useState(false);

  useEffect(() => {
    // 인증토큰, 이메일이 있으면 -> 자동로그인 시도
    // 시도 실패시,
    // 구글로그인 구성 세팅...
    configureGoogleSignIn();
  }, []);

  const configureGoogleSignIn = () => {
    console.log('=== configureGoogleSignIn ===');
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
      offlineAccess: true,
    });
  };

  const handleGoogleSignIn = async () => {
    if (isSigningIn) return; // 이미 로그인 중이라면 함수를 종료
    setSigningIn(true);
    try {
      console.log('=== handleGoogleSignIn ===');
      const googleUserInfo = await GoogleSignin.signIn();
      // googleUserInfo response...
      // scopes
      // serverAuthCode
      // idToken
      // user
      // -- photo
      // -- givenName
      // -- familyName
      // -- email
      // -- name
      // -- id
      if (googleUserInfo) {
        // 로그인 성공 여부 확인
        console.log('Google-Sign-In success');
        // OAuth2 인증 실행...
        callOAuth2('google', googleUserInfo);
      } else {
        const errorMessage = JSON.stringify(data);
        console.log(`Google-Sign-In fail: ${errorMessage}`);
        errorAlert(errorMessage); // 로그인 실패 알림
      }
    } catch (error) {
      // 기타 오류 처리
      console.error('Google-Sign-In error:', error);
      errorAlert(error);
    } finally {
      setSigningIn(false);
    }
  };

  const callOAuth2 = async (apiType, userData) => {
    console.log('CUSTOM_LOG: === callOAuth2 ===');
    try {
      const data = await OAuth2Service({
        apiType: apiType,
        idToken: userData.idToken.trim(),
      });
      if (data) {
        // 로그인 성공 여부 확인
        console.log('CUSTOM_LOG: OAuth2 success');
        // 인증 성공시...
        // 리턴 받은 값에서 토큰 저장
        // 리턴 받은 값에서 email 저장
        StorageService({svcType: 'saveAuthToken', authToken: data.authToken});
        StorageService({svcType: 'saveEmail', email: data.user.email});
        handleSignIn();
      } else {
        const errorMessage = JSON.stringify(data);
        console.log(
          `CUSTOM_LOG: ================================================================================================`,
        );
        console.log(`CUSTOM_LOG: userData: ${JSON.stringify(userData)}`);
        console.log(`CUSTOM_LOG: OAuth2 fail: ${errorMessage}`);
        console.log(
          `CUSTOM_LOG: ================================================================================================`,
        );
        errorAlert(errorMessage); // 로그인 실패 알림
        handleUserInfoClear();
      }
    } catch (error) {
      console.log(`OAuth2 error: ${error}`);
      errorAlert(error);
      handleUserInfoClear();
    }
  };

  // 로그인 실행
  const handleSignIn = async () => {
    console.log('=== handleSignIn ===');

    // 제목변경 API호출
    try {
      const data = await LoginService({apiType: 'in'});
      if (data && data.code === '200') {
        // 로그인 성공 여부 확인
        console.log('Sign-In success');
        userIn(data.user);
        navigation.navigate('MainScreen'); // 메인 화면으로 이동
      } else {
        const errorMessage = JSON.stringify(data);
        console.log(`Sign-In fail: ${errorMessage}`);
        errorAlert(errorMessage); // 로그인 실패 알림
        handleUserInfoClear();
      }
    } catch (error) {
      console.log(`Sign-In error: ${error}`);
      errorAlert(error);
      handleUserInfoClear();
    }
  };

  const handleUserInfoClear = async () => {
    // 제목변경 API호출
    StorageService({svcType: 'clear'}); // 저장소에 데이터 제거
    handleGoogleSignOut();
    userOut(); // 훅에서 유저 제거
    console.log('handleUserInfoClear success');
  };

  const handleGoogleSignOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    } catch (error) {
      console.error('handleGoogleSignOut Google Sign-Out error:', error);
    }
  };

  // 로그인 실패 알림창
  const errorAlert = errorMessage => {
    // 테스트용
    // Alert.alert(`로그인 실패하였습니다. ${errorMessage}`);
    Alert.alert(`로그인 실패하였습니다.`);
  }

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.appIconContainer}>
        <Image source={honeydogaichat_icon} style={styles.appIcon} />
      </View>
      <View style={styles.signInButtonContainer}>
        <GoogleSigninButton
          style={styles.googleSignInButton}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={handleGoogleSignIn}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  appIconContainer: {
    marginTop: '20%',
  },
  appIcon: {
    width: 300,
    height: 300,
  },
  signInButtonContainer: {
    position: 'absolute',
    bottom: '25%',
  },
  googleSignInButton: {
    width: 262,
    height: 48,
  },
});

export default LoginScreen;
