/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import {API_URL} from '@env';

// 친구관리 관련 서비스
const FriendService = async props => {
  const PATH = '/api/v2/app/friend';
  let data;
  let apiEndpoint = PATH;
  let response;
  let param;
  let body;
  let url = API_URL;

  try {
    // props에 따라 다른 API 호출
    if (props.apiType === 'save') {
      // 친구관계 생성/수정
      console.log('=== save ===');
      apiEndpoint += '';

      body = JSON.stringify({
        userUuid: props.userUuid,
        friendEmail: props.friendEmail,
        friendStatus: props.friendStatus,
      });

      response = await fetch(url + apiEndpoint, {
        method : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      });
    } else if (props.apiType === 'save') {
      // AI친구관계 생성/수정
      console.log('=== aiSave ===');
      apiEndpoint += '/ai';

      body = JSON.stringify({
        userUuid: props.userUuid,
        aiUserUuid: props.aiUserUuid,
        friendStatus: props.friendStatus,
      });

      response = await fetch(url + apiEndpoint, {
        method : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      });
    } else if (props.apiType === 'findFriendList') {
      // 친구목록 조회
      console.log('=== findFriendList ===');
      let userUuid = props.userUuid;
      let friendStatus = props.friendStatus; // REQUESTED, ACCEPTED, BLOCKED, NO_RELATION
      let friendType = props.friendType; // AI/HUMAN
      apiEndpoint += '/list';
      param = '?userUuid=' + userUuid;
      param += '&friendStatus=' + friendStatus;
      param += '&friendType=' + friendType;

      response = await fetch(url + apiEndpoint + param);
    } else if (props.apiType === 'findInterFriendListByUser') {
      // 상호친구목록 조회
      console.log('=== findInterFriendListByUser ===');
      apiEndpoint += '/inter-list';
      param = `?userUuid=${props.userUuid}`;

      response = await fetch(url + apiEndpoint + param);
    } else if (props.apiType === 'findInterFriendListByUserNotInRoom') {
      // 상호친구목록 조회
      console.log('=== findInterFriendListByUserNotInRoom ===');
      apiEndpoint += '/inter-list/not-in-room';
      param = `?userUuid=${props.userUuid}&roomUuid=${props.roomUuid}`;

      response = await fetch(url + apiEndpoint + param);
    }else if (props.apiType === 'findReverseFriendList') {
      // 받은 친구목록 조회
      console.log('=== findReverseFriendList ===');
      let userUuid = props.userUuid;
      let friendStatus = props.friendStatus; // REQUESTED, BLOCKED
      let friendType = props.friendType; // only HUMAN
      apiEndpoint += '/reverse-list';
      param = '?userUuid=' + userUuid;
      param += '&friendStatus=' + friendStatus;
      param += '&friendType=' + friendType;

      response = await fetch(url + apiEndpoint + param);
    } else {
      console.log(`FriendService api path not found api: ${props.apiType}`);
      return null;
    }

    if (!response.ok) {
      // throw new Error('Network response was not ok');
      console.log('Network response was not ok');
    } else {
      data = await response.json();
    }
  } catch (error) {
    console.log(`FriendService ${props.apiType} api request: [url: ${url} path: ${apiEndpoint},
      body:${JSON.stringify(body)}, param: ${param}],
      response: ${JSON.stringify(response)}, error: ${error}`);
    data = null;
  } finally {
    return data;
  }
};

export default FriendService;
