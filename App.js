/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {SafeAreaView, StyleSheet, StatusBar, View, Text} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {WebView} from 'react-native-webview';
import SwipeableList from './components/SwipeableList';

const data = [
  'https://vetrostudios.io',
  'https://www.google.com',
  'https://www.apple.com',
];

const App = () => {
  return (
    <SafeAreaProvider>
      <StatusBar />
      <SafeAreaView style={styles.container}>
        <SwipeableList
          data={data}
          borderRadius={8}
          initialScale={0.8}
          renderItems={(item, index) => (
            <View style={styles.item}>
              <WebView
                style={{borderRadius: 8}}
                source={{uri: item}}
                scrollEnabled="false"
              />
            </View>
          )}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1.0,

    elevation: 1,
    flex: 1,
    borderRadius: 8,
  },
});

export default App;
