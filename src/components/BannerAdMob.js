import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';
import {GOOGLE_AD_ANDROID_ID} from '@env';

const unitID =
  Platform.select({
    android: GOOGLE_AD_ANDROID_ID
  }) || '';

const adUnitId = __DEV__ ? TestIds.BANNER : unitID;

const BannerAdMob = () => {
  return (
    <View style={styles.adMob}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.FULL_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  adMob: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default BannerAdMob;