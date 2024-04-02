import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert } from 'react-native';
import {useUser} from '../components/provider/UserProvider';
import PostsService from '../services/api/PostsServices';

const PostsScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const {user} = useUser();

  // 문의 제출 핸들러
  const handleSubmit = async () => {
    try {
        const data = await PostsService({apiType: 'save', title: title, content: content, author: user.email});
        if (data) {
          console.log('Submit success');
          Alert.alert('문의가 완료되었습니다.', '', [
            { text: "OK", onPress: () => navigation.goBack() } // Alert 확인 시 이전 화면으로 돌아감
          ]);
        } else {
          console.log(`Submit fail: ${JSON.stringify(data)}`);
          errorAlert('문의하기에 실패하였습니다.');
        }
      } catch (error) {
        console.log(`Submit error: ${error}`);
        errorAlert('문의하기에 실패하였습니다.');
      }
    console.log('제출된 문의:', { title, content });
  };

  const errorAlert = (errorMessage) => Alert.alert(errorMessage);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>제목 (20자 이내):</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={(text) => setTitle(text.substring(0, 20))}
        maxLength={20}
      />
      <Text style={styles.label}>내용 (200자 이내):</Text>
      <TextInput
        style={styles.textarea}
        value={content}
        onChangeText={(text) => setContent(text.substring(0, 200))}
        maxLength={200}
        multiline={true}
        numberOfLines={4}
      />
      <Button title="문의하기" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    marginBottom: 15,
    paddingHorizontal: 10,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
  },
  textarea: {
    marginBottom: 20,
    paddingHorizontal: 10,
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    textAlignVertical: 'top',
  },
});

export default PostsScreen;
