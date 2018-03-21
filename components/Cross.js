/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View
} from 'react-native'

export default class Cross extends Component {
  render() {
    const { xTranslate, yTranslate, color } = this.props
    return (
      <View style={[styles.container, {
        transform: [
          {translateX: (xTranslate ? xTranslate : 100)},
          {translateY: (yTranslate ? yTranslate : 10)},
        ]
      }]}>
        <View style={[styles.line, {
          transform: [
            {
              rotate: '45deg',
            },
          ],
          backgroundColor: color ? color : '#000'
        }]} />
        <View style={[styles.line1, {
          transform: [
            {rotate: '45deg'},
          ],
          backgroundColor: color ? color : '#000'
        }]} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 80,
    height: 80,
  },
  line: {
    position: 'absolute',
    width: 8,
    height: 70,
    left:'50%',
    top:'50%',
    marginLeft:-4,
    marginTop:-35,
  },
  line1: {
    position: 'absolute',
    width: 70,
    height: 8,
    left:'50%',
    top:'50%',
    marginLeft:-35,
    marginTop:-4,
  },

})
