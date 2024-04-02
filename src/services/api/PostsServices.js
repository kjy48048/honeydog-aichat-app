/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import {API_URL} from '@env';

// 문의하기 관련 서비스
const PostsService = async props => {
  let url = API_URL;
  let data;

  try {
    let response;
    // props에 따라 다른 API 호출
    if (props.apiType === 'save') {
        // 문의하기 저장요청
      console.log('=== save ===');
      let apiEndpoint = '/api/v1/posts';

      body = JSON.stringify({
        title: props.title,
        content: props.content,
        author: props.author
      });

      response = await fetch(url + apiEndpoint, {
        method : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      });
    }

    if (!response.ok) {
        console.log('Network response was not ok');
      } else {
        data = await response.json();
      }
  } catch (error) {
    console.log('=== PostsServiceError ===');
    if(!response) {
      console.error(response.status);
      console.error(response.statusText);
    }
    console.error(error);
    data = null;
  } finally {
    return data;
  }
};

export default PostsService;
