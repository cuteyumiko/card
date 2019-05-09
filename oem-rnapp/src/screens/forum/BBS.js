import React, { Component } from 'react';
import {
  Text, View, Image,
  TouchableOpacity, ScrollView,
} from 'react-native';
import VideoOK from '../../components/VideoOK';

import { withNavigation } from 'react-navigation';

import _ from 'lodash';
import axios from 'axios';

class Screen extends Component {
  state = {
  }
  render() {
    return (
      <ScrollView style={{flex: 1, backgroundColor:'#fff'}}>

      </ScrollView>
    );
  }
  async componentDidMount() {
  }
}

export default withNavigation(Screen)
