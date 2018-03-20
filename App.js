import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import App1 from './components/App'

export default class App extends React.Component {
  render() {
    return (
      <App1 />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
