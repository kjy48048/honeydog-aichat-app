/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import {API_URL} from '@env';

// 채팅기록 관련 서비스
const ChatHistoryService = async props => {
  let url = API_URL;
  const PATH = url + '/api/v2/app/chat';
  let data;
  try {
    let apiEndpoint = '';
    let methodType = '';
    let response;
    // props에 따라 다른 API 호출
    if (props.apiType === 'findAppChatList') {
        // 채팅기록 가져오기
        console.log('=== findAppChatList ===');
        const roomUuid = props.roomUuid;
        const page = props.page;
        const pageSize = props.pageSize;
        apiEndpoint = `/room?roomUuid=${roomUuid}&page=${page}&pageSize=${pageSize}`;
        methodType = 'GET';
    }

    // GET방식으로 호출
    response = await fetch(PATH + apiEndpoint);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    data = await response.json();
  } catch (error) {
    console.log('=== ChatHistoryServiceError ===');
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

export default ChatHistoryService;
