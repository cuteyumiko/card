import React, { Component } from 'react';
import {
  Text, View,
  TouchableOpacity,
} from 'react-native';

export default class Screen extends Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <Text style={{fontSize: 20, textAlign: 'center', margin: 10}}>
          88折油卡
        </Text>
      </View>
    );
  }
  componentDidMount() {
  }
}
