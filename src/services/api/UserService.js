/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import {API_URL} from '@env';

// 채팅 유저 관련 서비스
const UserService = async props => {
  let url = API_URL;
  const PATH = url + '/api/v2/app/user';
  let data;
  try {
    let apiEndpoint = '';
    let response;
    // props에 따라 다른 API 호출
    if (props.apiType === 'create') {
      // 유저 생성요청
      console.log('=== create ===');
      apiEndpoint = '';

      response = await fetch(PATH + apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({data: props.body}),
      });
    } else if (props.apiType === 'findByUuid') {
      // 유저 유저번호로 조회요청
      console.log('=== findByUuid ===');
      const userUuid = props.userUuid;
      apiEndpoint = `?userUuid=${userUuid}`;

      response = await fetch(PATH + apiEndpoint);
    } else if (props.apiType === 'findAllAiUser') {
      // 모든 AI 유저 조회
      console.log('=== findAllAiUser ===');
      const userUuid = props.userUuid;
      apiEndpoint = `/ai/list/user/${userUuid}`;

      response = await fetch(PATH + apiEndpoint);
    } else if (props.apiType === 'findUserByNickLikeNotMe') {
      // 본인제외 닉네임으로 유저찾기(친구찾기 기능)
      console.log('=== findUserByNickLikeNotMe ===');
      const userUuid = props.userUuid;
      const nick = props.nick;
      apiEndpoint = `/user/nick/like?userUuid=${userUuid}&nick=${nick}`;

      response = await fetch(PATH + apiEndpoint);
    } else if (props.apiType === 'findUserByEmailLikeNotMe') {
      // 본인제외 이메일로 유저찾기(친구찾기 기능)
      console.log('=== findUserByEmailLikeNotMe ===');
      const userUuid = props.userUuid;
      const email = props.email;
      apiEndpoint = `/user/email/like?userUuid=${userUuid}&email=${email}`;

      response = await fetch(PATH + apiEndpoint);
    } else if (
      props.apiType === 'updateNick' ||
      props.apiType === 'updateGreetings' ||
      props.apiType === 'updateGreetings'
    ) {
      // 유저 닉네임 업데이트 요청
      console.log('=== updateUser ===');
      const userUuid = props.userUuid;

      body = JSON.stringify({
        nick: props.nick,
        picture: props.picture,
        greetings: props.greetings,
      });

      apiEndpoint = `/userUuid/${userUuid}`;

      response = await fetch(PATH + apiEndpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      });
    } else if (props.apiType === 'withdrawUser') {
      // 유저 탈퇴 요청
      console.log('=== withdrawUser ===');
      const userUuid = props.userUuid;

      apiEndpoint = `/withdraw/${userUuid}`;

      response = await fetch(PATH + apiEndpoint, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    data = await response.json();
  } catch (error) {
    console.error(error);
    data = null;
  } finally {
    return data;
  }
};

export default UserService;