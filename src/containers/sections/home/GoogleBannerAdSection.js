import React from 'react';
import {View, StyleSheet} from 'react-native';
import BannerAdMob from '../../../components/BannerAdMob';

const GoogleBannerAdSection = () => {
  return (
    <View style={styles.bannerAdSection}>
      <BannerAdMob />
    </View>
  );
};
const styles = StyleSheet.create({
  bannerAdSection: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
export default GoogleBannerAdSection;
