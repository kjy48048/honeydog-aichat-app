/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import StorageService from '../service/StorageService';
import {API_URL} from '@env';

// 채팅 유저 관련 서비스
const LoginService = async props => {
  let url = API_URL;
  const PATH = url + '/api/v2/app/log';

  const user = props.user;

  const authToken = await StorageService({ svcType: 'retrieveAuthToken' });
  const deviceId = await StorageService({ svcType: 'deviceId' });
  const email = await StorageService({ svcType: 'retrieveEmail' });

  let data;
  try {
    let apiEndpoint = '';
    let response;
    // props에 따라 다른 API 호출
    if (props.apiType === 'in') {
      // 로그인 요청
      console.log('=== in ===');
      apiEndpoint = '/in';

      body = JSON.stringify({
        deviceId: deviceId,
        email: email,
      });

      {
        // 테스트 콘솔 출력용....
        let testBody = JSON.stringify({
          deviceId: deviceId,
          email: email,
        });

        //console.log(`testBody: ${testBody}`);
      }

      response = await fetch(PATH + apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + authToken,
        },
        body: body,
      });
    } else if (props.apiType === 'out') {
      // 로그아웃요청
      console.log('=== out ===');
      apiEndpoint = '/out';

      body = JSON.stringify({
        userUuid: user.userUuid,
        deviceId: deviceId,
        email: email,
      });

      response = await fetch(PATH + apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + authToken,
        },
        body: body,
      });
    } else {
      // 잘못된 요청...
      console.log(`LoginService api path not found api: ${props.apiType}`);
      return null;
    }

    if (!response.ok) {
      console.log('Network response was not ok');
    }
    data = await response.json();
  } catch (error) {
    console.log(`LoginService ${
      props.apiType
    } api request: [url: ${url} path: ${apiEndpoint},
        body:${JSON.stringify(body)}, param: ${param}],
        response: ${JSON.stringify(response)}, error: ${error}`);
    data = null;
  } finally {
    return data;
  }
};

export default LoginService;
