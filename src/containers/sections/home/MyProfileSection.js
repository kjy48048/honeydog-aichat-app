import React from 'react';
import {
  Image,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const MyProfileSection = ({user, onEditNickname, onEditGreeting}) => {
  if (!user) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.profileSection}>
      <Image source={{uri: user.picture}} style={styles.profileImage} />
      <View style={styles.userInfoContainer}>
        <View style={styles.nickAndEditContainer}>
          <TouchableOpacity onPress={() => onEditNickname(user.nick)}>
            <Text style={styles.profileText}>{user.nick}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.greetingAndEditContainer}>
          <TouchableOpacity onPress={() => onEditGreeting(user.greetings)}>
            <Text style={styles.greetingText}>{user.greetings || '안녕하세요 만나서 반갑습니다!'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userInfoContainer: {
    flex: 1,
    marginLeft: 10,
  },
  nickAndEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  greetingAndEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 5,
  },
  profileText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  greetingText: {
    fontSize: 14,
  },
  editIcon: {
    marginLeft: 5,
  },
});

export default MyProfileSection;
