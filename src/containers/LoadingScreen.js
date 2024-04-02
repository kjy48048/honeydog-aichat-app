import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useUser } from '../components/provider/UserProvider';
import LoginService from '../services/api/LoginService';
import StorageService from '../services/service/StorageService';

const LoadingScreen = () => {
  const navigation = useNavigation();
  const { userIn } = useUser();

  // 앱이 마운트될 때 사용자 로그인 상태 확인
  useEffect(() => {
    checkLoginStatus();
  }, []);

  // 자동로그인...
  const autoSignIn = async () => {
    console.log('=== autoSignIn ===');

    // 제목변경 API호출
    try {
      const data = await LoginService({ apiType: 'in'} );
      if (data && data.code === '200') { // 로그인 성공 여부 확인
        console.log('Sign-In success');
        userIn(data.user);
        // 스택 초기화 후 메인 화면으로 이동
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainScreen' }],
        });
      } else {
        console.log(`Sign-In fail: ${JSON.stringify(data)}`);
        navigation.reset({
          index: 0,
          routes: [{ name: 'LoginScreen' }],
        });
      }
    } catch (error) {
      console.log(`Sign-In error: ${error}`);
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }],
      });
    }
  };


  const checkLoginStatus = async () => {
    // 로그인 상태체크 로직.
    // Storage에서 토큰을 가져와서 유효성 확인
    const isLoggedIn = await StorageService( { svcType: 'checkAutoLoginData' });
    if(isLoggedIn) {
      // 성공시 자동로그인 로직 수행
      console.log('=== isLoggedIn success ===');
      autoSignIn();
    } else {
      // 실패시 로그인화면 이동
      console.log('=== isLoggedIn fail ===');
      navigation.navigate('LoginScreen');
    }
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    marginTop: 20,
    fontSize: 20,
    color: '#333',
  },
});

export default LoadingScreen;
