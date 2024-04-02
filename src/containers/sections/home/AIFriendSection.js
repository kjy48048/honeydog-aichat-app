import React from 'react';
import {
  Button,
  Image,
  Text,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const defaultImageUri = ''; // 기본 이미지 URL 추가

const AIFriendSection = ({ aiFriends, onAiChat, onNavigateProfile }) => {
  // 인사말을 최대 길이로 제한하고 생략 처리하는 함수
  const truncate = (str, maxLength = 30) => {
    return str.length > maxLength ? str.substring(0, maxLength - 3) + '...' : str;
  };

  return (
    <View style={styles.aiFriendSection}>
      <Text>AI 친구</Text>
      <View style={styles.aiFriendsContainer}>
        <ScrollView horizontal>
          {aiFriends.map((friend, index) => {
            const friendWithIsAI = { ...friend, isAI: true };
            return (
            <View key={index} style={styles.aiFriendItem}>
              <TouchableOpacity key={index} onPress={() => onNavigateProfile(friendWithIsAI)} style={styles.aiFriendTouch}>
                <Image
                  source={{ uri: friend.picture || defaultImageUri }}
                  style={styles.friendImage}
                  resizeMode="cover"
                />
                <Text style={styles.friendNick}>{friend.nick}</Text>
                <Text style={styles.descriptionText}>
                  {truncate(friend.greetings)}
                </Text>
              </TouchableOpacity>
              <View style={styles.buttonContainer}>
                <Button title="대화하기" color="#007bff" onPress={() => onAiChat(friend.userUuid, friend.nick)} />
              </View>
            </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // 스타일은 이전과 동일하게 유지
  aiFriendSection: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  aiFriendsContainer: {
    padding: 10,
    borderRadius: 5,
  },
  aiFriendItem: {
    width: windowWidth / 4, // 각 친구 영역의 너비를 화면 너비의 1/4로 설정
    backgroundColor: '#d2b48c',
    marginRight: 10,
    alignItems: 'center',
    padding: 5,
  },
  aiFriendTouch: {
    alignItems: 'center',
  },
  friendImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
  },
  friendNick: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: 12,
    textAlign: 'center', // 텍스트를 중앙 정렬
    marginBottom: 10,
  },
  buttonContainer: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default AIFriendSection;
