/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import {API_URL} from '@env';

// 채팅방 관련 서비스
const RoomService = async props => {
  const PATH = '/api/v2/app/room';
  let data;
  let apiEndpoint = PATH;
  let response;
  let param;
  let body;
  let url = API_URL;

  try {
    // props에 따라 다른 API 호출
    if (props.apiType === 'save') {
      // 채팅방 생성
      console.log('=== save ===');
      apiEndpoint += '';

      body = JSON.stringify({
        roomUuid: props.roomUuid,
        userUuid: props.userUuid,
        roomNick: props.roomNick,
        friendEmails: props.friendEmails,
        aiUserUuid: props.aiUserUuid,
        roomStatus: props.roomStatus,
        roomType: props.roomType,
      });

      response = await fetch(url + apiEndpoint, {
        method : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      });
    } else if(props.apiType === 'updateNick') {
      // 채팅방 나가기
      console.log('=== updateNick ===');
      apiEndpoint += '/update-nick';

      body = JSON.stringify({
        roomUuid: props.roomUuid,
        userUuid: props.userUuid,
        roomNick: props.roomNick,
      });

      response = await fetch(url + apiEndpoint, {
        method : 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      });
    } else if (props.apiType === 'outRoom') {
      // 채팅방 나가기
      console.log('=== outRoom ===');
      let roomUuid = props.roomUuid;
      apiEndpoint += '/out-room/room-id/' + roomUuid;

      response = await fetch(url + apiEndpoint, {method : 'PUT'});
    } else if (props.apiType === 'findRoomByRoomUuId') {
      // 채팅방 조회
      console.log('=== findRoomByRoomUuId ===');
      let roomUuid = props.roomUuid;
      apiEndpoint += '/room-id';
      param = '?roomUuid=' + roomUuid;

      response = await fetch(url + apiEndpoint + param);
    }  else if (props.apiType === 'findJoinRooms') {
      // 채팅방목록 조회
      console.log('=== findJoinRooms ===');
      let userUuid = props.userUuid;
      apiEndpoint += '/list/user-id';
      param = '?userUuid=' + userUuid;

      response = await fetch(url + apiEndpoint + param);
    } else {
      console.log(`RoomService api path not found api: ${props.apiType}, fetchUrl: ${url + apiEndpoint + param}`);
      return null;
    }

    if (!response.ok) {
      console.log('Network response was not ok');
    } else {
      data = await response.json();
    }
  } catch (error) {
    console.log(`RoomService ${props.apiType} api request: [url: ${url} path: ${apiEndpoint},
      body:${JSON.stringify(body)}, param: ${param}],
      response: ${JSON.stringify(response)}, error: ${error}`);
    data = null;
  } finally {
    return data;
  }
};

export default RoomService;
