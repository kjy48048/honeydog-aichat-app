/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import 'react-native-gesture-handler';
import {TextDecoder, TextEncoder} from 'text-encoding-polyfill';
import TabBarIcon from './src/components/TabBarIcon';
import UserProvider from './src/components/provider/UserProvider';
import ChatListScreen from './src/containers/ChatListScreen';
import ChatScreen from './src/containers/ChatScreen';
import HomeScreen from './src/containers/HomeScreen';
import LoginScreen from './src/containers/LoginScreen';
import LoadingScreen from './src/containers/LoadingScreen';
import SettingScreen from './src/containers/SettingScreen';
import FriendsListScreen from './src/containers/FriendsListScreen';
import SearchFriendsScreen from './src/containers/SearchFriendsScreen';
import SentRequestsScreen from './src/containers/SentRequestsScreen';
import ReceivedRequestsScreen from './src/containers/ReceivedRequestsScreen';
import BlockedUsersScreen from './src/containers/BlockedUsersScreen';
import UserProfileScreen from './src/containers/UserProfileScreen';
import PostsScreen from './src/containers/PostsScreen';
import AIFriendsManagementScreen from './src/containers/AIFriendsManagementScreen';

// 글로벌 객체에 TextEncoder와 TextDecoder 설정
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const App = () => {
  const Tab = createBottomTabNavigator();
  const Stack = createStackNavigator();

  const MainTabNavigator = () => (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => ({
        headerStyle: {
          backgroundColor: '#d2b48c', // 헤더의 배경색 설정
        },
        headerTintColor: '#fff', // 헤더 타이틀 색상 설정
        headerTitleStyle: {
          fontWeight: 'bold', // 헤더 타이틀 글꼴 두께 설정
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: '#fff',
        tabBarStyle: {
          backgroundColor: '#d2b48c',
        },
        tabBarLabelPosition: 'below-icon',
        tabBarLabel: route.name,
        tabBarIcon: ({focused}) => TabBarIcon(focused, route.name),
      })}>
      <Tab.Screen name="홈" component={HomeScreen} />
      <Tab.Screen name="채팅목록" component={ChatListScreen} />
      <Tab.Screen name="설정" component={SettingScreen} />
    </Tab.Navigator>
  );

  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#d2b48c', // 헤더의 배경색 설정
            },
            headerTintColor: '#fff', // 헤더 타이틀 색상 설정
            headerTitleStyle: {
              fontWeight: 'bold', // 헤더 타이틀 글꼴 두께 설정
            },
          }}
          initialRouteName="LoadingScreen"
        >
          <Stack.Screen
            name="LoadingScreen"
            component={LoadingScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="MainScreen"
            component={MainTabNavigator}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ChatScreen"
            component={ChatScreen}
            options={{title: 'Chat'}}
          />
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{title: 'Login', headerShown: false}}
          />
          <Stack.Screen
            name="FriendsListScreen"
            component={FriendsListScreen}
            options={{title: '내 친구 목록'}}
          />
          <Stack.Screen
            name="SearchFriendsScreen"
            component={SearchFriendsScreen}
            options={{title: '친구 찾기'}}
          />
          <Stack.Screen
            name="SentRequestsScreen"
            component={SentRequestsScreen}
            options={{title: '보낸 친구 신청'}}
          />
          <Stack.Screen
            name="ReceivedRequestsScreen"
            component={ReceivedRequestsScreen}
            options={{title: '받은 친구 신청'}}
          />
          <Stack.Screen
            name="BlockedUsersScreen"
            component={BlockedUsersScreen}
            options={{title: '내 차단 목록'}}
          />
          <Stack.Screen
            name="UserProfileScreen"
            component={UserProfileScreen}
            options={{title: '',
            headerTintColor: '#a52a2a', // 헤더 타이틀 색상 설정
            headerStyle: {
              backgroundColor: '#fff', // 헤더 배경색
            }}}
          />
          <Stack.Screen
            name="PostsScreen"
            component={PostsScreen}
            options={{title: '문의하기'}}
          />
          <Stack.Screen
            name="AIFriendsManagementScreen"
            component={AIFriendsManagementScreen}
            options={{title: '내 AI 관리'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
};

export default App;
