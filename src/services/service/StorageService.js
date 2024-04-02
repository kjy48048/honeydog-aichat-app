/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import EncryptedStorage from 'react-native-encrypted-storage';
import { getUniqueId } from 'react-native-device-info';

// EncryptedStorage 관련 서비스
const StorageService = async props => {
  // 토큰가져오기
  const retrieveAuthToken = async () => {
    let storageToken;
    try {
      storageToken = await EncryptedStorage.getItem('auth_token');

      if (storageToken !== undefined && storageToken !== null && storageToken !== '') {
        console.log('retrieveAuthToken success...');
      } else {
        storageToken = '';
      }
    } catch (error) {
      console.log('retrieveAuthToken error...');
      storageToken = '';
    }
    return storageToken;
  };
  // 이메일가져오기
  const retrieveEmail = async () => {
    let storageEmail;
    try {
      storageEmail = await EncryptedStorage.getItem('email');

      if (storageEmail !== undefined && storageEmail !== null && storageEmail !== '') {
        console.log('retrieveEmail success...');
      } else {
        storageEmail = '';
      }
    } catch (error) {
      console.log('retrieveEmail error...');
    }
    return storageEmail;
  };

  let data;
  try {
    // props에 따라 다른 정보 호출
    if (props.svcType === 'retrieveAuthToken') {
      // 인증토큰 요청
      console.log('=== retrieveAuthToken ===');
      data = await retrieveAuthToken(); // await 추가
    } else if (props.svcType === 'saveAuthToken') {
      // 인증토큰 저장 요청
      console.log('=== saveAuthToken ===');
      console.log(`authToken: ${props.authToken}`);
      try {
        await EncryptedStorage.setItem('auth_token', props.authToken);
        console.log('EncryptedStorage saveAuthToken is success');
      } catch (error) {
        console.log(`EncryptedStorage saveAuthToken is error: ${error}`);
      }
    } else if (props.svcType === 'deviceId') {
      // 디바이스 아이디 요청
      console.log('=== deviceId ===');
      // 디바이스별 고유한 ID
      data = getUniqueId();
    } else if (props.svcType === 'retrieveEmail') {
      // 이메일 요청
      console.log('=== retrieveEmail ===');
      data = await retrieveEmail(); // await 추가
    } else if (props.svcType === 'saveEmail') {
      // 인증토큰 저장 요청
      console.log('=== saveEmail ===');
      console.log(`saveEmail: ${props.email}`);
      try {
        await EncryptedStorage.setItem('email', props.email);
        console.log('EncryptedStorage saveEmail is success');
      } catch (error) {
        console.log(`EncryptedStorage saveEmail is error: ${error}`);
      }
    } else if (props.svcType === 'clear') {
        console.log('=== clear ===');
        try {
        await EncryptedStorage.clear();
        console.log('EncryptedStorage clear is success');
      } catch (error) {
        console.log(`EncryptedStorage clear is error: ${error}`);
      }
    } else if (props.svcType === 'checkAutoLoginData') {
      // 자동로그인용 데이터 체크
      console.log('=== checkAutoLoginData ===');
      const authTokenData = await retrieveAuthToken();
      const emailData = await retrieveEmail();

      data = authTokenData !== '' && emailData !== '';
    } else if (props.svcType === 'retrieveFriends') {
      // 로컬 스토리지에서 친구 목록 조회
      console.log('=== retrieveFriends ===');
      data = await EncryptedStorage.getItem('friends');
    } else if (props.svcType === 'saveFriends') {
      // 로컬 스토리지에 친구 목록을 저장
      console.log('=== saveFriends ===');
      try {
        await EncryptedStorage.setItem('friends', props.friends);
        console.log('EncryptedStorage saveFriends is success');
      } catch (error) {
        console.log(`EncryptedStorage saveFriends is error: ${error}`);
      }
    } else if (props.svcType === 'retrieveAiFriends') {
      // 로컬 스토리지에서 AI 친구 목록 조회
      console.log('=== retrieveAiFriends ===');
      data = await EncryptedStorage.getItem('ai_friends');
    } else if (props.svcType === 'saveAiFriends') {
      // 로컬 스토리지에 AI 친구 목록을 저장
      console.log('=== saveAiFriends ===');
      try {
        await EncryptedStorage.setItem('ai_friends', props.aiFriends);
        console.log('EncryptedStorage saveAiFriends is success');
      } catch (error) {
        console.log(`EncryptedStorage saveAiFriends is error: ${error}`);
      }
    } else if (props.svcType === 'retrieveRecommends') {
      // 로컬 스토리지에서 AI 친구 목록 조회
      console.log('=== retrieveRecommends ===');
      data = await EncryptedStorage.getItem('recommends');
    } else if (props.svcType === 'saveRecommends') {
      // 로컬 스토리지에 AI 친구 목록을 저장
      console.log('=== saveRecommends ===');
      try {
        await EncryptedStorage.setItem('recommends', props.recommends);
        console.log('EncryptedStorage saveRecommends is success');
      } catch (error) {
        console.log(`EncryptedStorage saveRecommends is error: ${error}`);
      }
    } else if (props.svcType === 'retrieveChats') {
      // 로컬 스토리지에서 AI 친구 목록 조회
      console.log('=== retrieveChats ===');
      data = await EncryptedStorage.getItem(`chatHistory_${props.roomUuid}`);
    } else if (props.svcType === 'saveChats') {
      // 로컬 스토리지에 AI 친구 목록을 저장
      console.log('=== saveChats ===');
      try {
        await EncryptedStorage.setItem(`chatHistory_${props.roomUuid}`, props.message);
        console.log('EncryptedStorage saveChats is success');
      } catch (error) {
        console.log(`EncryptedStorage saveChats is error: ${error}`);
      }
    } else {
      // 잘못된 요청...
      console.log(`StorageService invalid request: ${props.svcType}`);
      return null;
    }
  } catch (error) {
    console.log(`StorageService error: ${error}`);
    data = null;
  } finally {
    return data;
  }
};

export default StorageService;
