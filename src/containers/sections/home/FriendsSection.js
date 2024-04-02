import React from 'react';
import {Image, Text, View, StyleSheet, ScrollView, TouchableOpacity, Button} from 'react-native';

const FriendsSection = ({friends, onChat, onNavigateProfile}) => {
  // 인사말이 10자 이상일 경우 말줄임표로 처리하는 함수
  const truncate = (text, length) => {
    if(text) return text.length > length ? text.substring(0, length) + '...' : text;
    return "안녕하세요."
  };

  return (
    <View style={styles.friendsSection}>
      <Text>친구</Text>
      <ScrollView>
        {friends.map((friend, index) => (
          <View key={index} style={styles.friendItem}>
            <TouchableOpacity key={index} onPress={() => onNavigateProfile(friend)} style={styles.friendItem}>
              <Image source={{uri: friend.picture}} style={styles.friendImage} />
              <View style={styles.textContainer}>
                <Text style={styles.friendNick}>{friend.nick}</Text>
                <Text style={styles.friendEmail}>{friend.email}</Text>
              </View>
              <View style={styles.rightContainer}>
                <View style={styles.buttonContainer}>
                  <Button title="대화하기" color="#007bff" onPress={() => onChat(friend.email, friend.nick)} />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  friendsSection: {
    flex: 1,
    padding: 10,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  rightContainer: {
    alignItems: 'flex-end',
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 10,
  },
  friendImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  friendNick: {
    fontWeight: 'bold',
  },
  friendEmail: {
    color: 'gray',
  },
  greetings: {
    marginBottom: 5,
    backgroundColor: 'lightgray', // 인사말 배경색 추가
    paddingHorizontal: 5, // 인사말 좌우 패딩 추가
    borderRadius: 5, // 인사말 배경 둥글게 처리
  },
  buttonContainer: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default FriendsSection;