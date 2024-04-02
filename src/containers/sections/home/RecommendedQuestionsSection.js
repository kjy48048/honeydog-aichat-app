import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';

const windowWidth = Dimensions.get('window').width;

const RecommendedQuestionsSection = ({recommends, onAiChat, onEditQuestion}) => {
  return (
    <View style={styles.questionsTitleSection}>
      <Text>추천 질문</Text>
      <View style={styles.questionsSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContainer}>
          {recommends.map((recommends, index) => {
            const recommendWithIsAI = { ...recommends, isAI: true };
            return (
            <View
              key={index}
              style={[
                styles.questionBox,
                {backgroundColor: recommends.color},
              ]}>
              <TouchableOpacity onPress={() => onAiChat(recommends.userUuid, recommends.nick)}>
                <Text style={styles.textColor}>{recommends.question}</Text>
              </TouchableOpacity>
            </View>
            );
            })}
          {/* <View style={styles.buttonContainer}>
            <Button title="편집" onPress={onEditQuestion} />
          </View> */}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  questionsTitleSection: {
    padding: 10,
  },
  questionsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  scrollViewContainer: {
    flexGrow: 1,
    alignItems: 'flex-start', // 변경된 부분
  },
  questionBox: {
    width: windowWidth / 4,
    height: 120,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  buttonContainer: {
    alignSelf: 'flex-start', // 변경된 부분
  },
  textColor: {
    color: '#333333'
  }
});

export default RecommendedQuestionsSection;
