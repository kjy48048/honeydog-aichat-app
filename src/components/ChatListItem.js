import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';

const ChatListItem = ({ item, onPressTitleChange, onPressDelete, onPressTitle }) => {
  const defaultImageUri = ''; // 기본 이미지 URL 추가

    return (
    <View style={styles.container}>
      <Image
        source={{ uri: item.picture || defaultImageUri }}
        style={styles.profileImage} // 프로필 이미지 스타일을 사용
        resizeMode="cover"
      />
      <View style={{ flex: 1 }}>
        <TouchableOpacity onPress={onPressTitle}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{item.roomNick || '새로운 채팅창'}</Text>
            <Text style={styles.modifiedDate}>{item.formattedModifiedDate}</Text>
          </View>
          <Text style={styles.lastMessage} numberOfLines={2} ellipsizeMode='tail'>{item.lastMessage || ''}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={onPressDelete}>
            <Ionicons name='trash' style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailsContainer: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modifiedDate: {
    fontSize: 14,
    color: '#888',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 30,
    height: 30,
    marginHorizontal: 5,
  },
});

export default ChatListItem;
