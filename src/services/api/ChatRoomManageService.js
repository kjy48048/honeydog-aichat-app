/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import {API_URL} from '@env';

// 채팅방의 유저 관련 서비스
const ChatRoomManageService = async props => {
  const PATH = API_URL + '/api/v2/app/user-room';
  let data;

  try {
    let response;
    // props에 따라 다른 API 호출
    if (props.apiType === 'invite') {
        // 문의하기 저장요청
      console.log('=== invite ===');
      let apiEndpoint = '/invite';

      body = JSON.stringify({
        userUuid: props.userUuid,
        roomUuid: props.roomUuid,
        inviteUserEmail: props.email,
        invitedAiUserUuid: props.aiUserUuid,
      });

      response = await fetch(PATH + apiEndpoint, {
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
    console.log('=== InviteService Error ===');
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

export default ChatRoomManageService;
