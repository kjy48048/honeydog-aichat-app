import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Button, Alert, Modal, TextInput } from 'react-native';

const AIFriendsManagementScreen = () => {
  const [aiFriends, setAiFriends] = useState([]); // AI 친구 목록 상태
  const [modalVisible, setModalVisible] = useState(false); // 모달 창 표시 상태
  const [newFriend, setNewFriend] = useState({
    nick: '',
    token: '',
    greetings: '',
    picture: ''
  }); // 새 AI 친구 입력 데이터

  const handleDelete = (index) => {
    Alert.alert("삭제 확인", "정말로 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      { text: "확인", onPress: () => {
          let updatedFriends = [...aiFriends];
          updatedFriends.splice(index, 1);
          setAiFriends(updatedFriends);
          Alert.alert("삭제되었습니다.");
        }
      }
    ]);
  };

  // 새 AI 친구 등록 모달
  const AIFriendModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TextInput style={styles.input} placeholder="닉네임" onChangeText={(text) => setNewFriend({...newFriend, nick: text})} />
          <TextInput style={styles.input} placeholder="OpenAIToken" onChangeText={(text) => setNewFriend({...newFriend, token: text})} />
          <TextInput style={styles.input} placeholder="인사말" onChangeText={(text) => setNewFriend({...newFriend, greetings: text})} />
          <TextInput style={styles.input} placeholder="프로필 이미지 주소" onChangeText={(text) => setNewFriend({...newFriend, picture: text})} />
          <Button title="생성하기" onPress={() => {/* 생성 로직 구현 */}} />
          <Button title="취소" onPress={() => setModalVisible(!modalVisible)} />
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI 친구 목록</Text>
      {aiFriends.length > 0 ? (
        <FlatList
          data={aiFriends}
          renderItem={({ item, index }) => (
            <View style={styles.listItem}>
              <Image source={{ uri: item.picture }} style={styles.profileImage} />
              <Text style={styles.name}>{item.nick}</Text>
              <Text>{item.greetings}</Text>
              <TouchableOpacity style={styles.cancelIcon} onPress={() => handleDelete(index)}>
                <Text style={styles.cancelText}>삭제하기</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <Text style={styles.noResultsText}>조회된 AI가 없습니다.</Text>
      )}
      <TouchableOpacity style={styles.addButton} onPress={() => Alert.alert("개발중입니다.")}>
        <Text style={styles.addButtonText}>새로운 AI 등록하기</Text>
      </TouchableOpacity>
      <AIFriendModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  name: {
    flex: 1,
  },
  cancelIcon: {
    marginRight: 10,
  },
  cancelText: {
    color: '#FF0000',
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 20,
  },
  addButton: {
    alignSelf: 'center',
    marginTop: 20,
    backgroundColor: '#007bff',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  space: {
    width: 10,
  },
});

export default AIFriendsManagementScreen;
