/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import {API_URL} from '@env';

// 추천질문 관련 서비스
const RecommendService = async props => {
  let url = API_URL;
  let data;

  try {
    let response;
    // props에 따라 다른 API 호출
    if (props.apiType === 'findAll') {
      // 추천질문 목록 요청
      console.log('=== findAll ===');
      let apiEndpoint = '/api/v2/app/recommend/list';

      // GET방식으로 호출
      response = await fetch(url + apiEndpoint);
    }

    if (!response.ok) {
      console.log('Network response was not ok');
    } else {
      data = await response.json();
    }
  } catch (error) {
    console.log(`=== RecommendService Error ===`);
    console.log(`=== error: ${error} ===`);
    if (!response) {
      console.error(response.status);
      console.error(response.statusText);
    }
    console.error(error);
    data = null;
  } finally {
    return data;
  }
};

export default RecommendService;
