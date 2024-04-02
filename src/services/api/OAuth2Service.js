/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import {API_URL} from '@env';

// 채팅 유저 관련 서비스
const OAuth2Service = async props => {
  let url = API_URL;
  const PATH = url + '/api/v2/oauth2';

  let data;
  try {
    let apiEndpoint = '';
    let response;
    // props에 따라 다른 API 호출
    if (props.apiType === 'google') {
      // 로그인 요청
      console.log('=== google ===');
      console.log(`=== PATH: ${PATH} ===`);
      apiEndpoint = '/google';

      response = await fetch(PATH + apiEndpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + props.idToken,
        },
      });
    } else {
      // 잘못된 요청...
      console.log(`OAuth2Service api path not found api: ${props.apiType}`);
      return null;
    }

    if (!response.ok) {
      console.log('Network response was not ok');
    }
    data = await response.json();
  } catch (error) {
    console.log(`OAuth2Service ${
      props.apiType
    } api request: [url: ${url} path: ${apiEndpoint},
        body:${JSON.stringify(body)}, param: ${param}],
        response: ${JSON.stringify(response)}, error: ${error}`);
    data = null;
  } finally {
    return data;
  }
};

export default OAuth2Service;
