/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {SafeAreaView, StyleSheet, StatusBar, View, Text} from 'react-native';
import {WebView} from 'react-native-webview';
import SwipeableList from './components/SwipeableList';

const data = [
  'https://vetrostudios.io',
  'https://www.google.com',
  'https://www.apple.com',
];

const App = () => {
  return (
    <>
      <StatusBar />
      <SafeAreaView style={styles.container}>
        <SwipeableList
          data={data}
          renderItems={(item, index) => (
            <View style={{flex: 1, width: '100%', height: '100%'}}>
              <WebView source={{uri: item}} scrollEnabled="false"/>
            </View>
          )}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
