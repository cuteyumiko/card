import React, { Component } from 'react';
import {
  Text, View,
  TouchableOpacity, Image, ScrollView,
  Linking, Modal, Clipboard,
} from 'react-native';
import { ModalIndicator, Toast } from 'teaset';

import LinearGradient from 'react-native-linear-gradient';

import _ from 'lodash';
import axios from 'axios';

import { connect } from 'react-redux'
import { actions } from '../redux';
const withRedux = connect(
  state => state.app,
  dispatch => ({
  })
);

class Screen extends Component {
  state = {
    list: []
  }
  render() {
    return (
      <View style={{flex: 1}}>
        <View style={{paddingTop:this.props.marginTop, backgroundColor:'#4959B8'}}>
          <View style={{flexDirection:'row', paddingVertical:10}}>
            <TouchableOpacity style={{flex:1}} onPress={ () => this.props.navigation.pop() }>
              <Image source={require('../assets/left-arrow-white.png')} style={{height:20, marginLeft: 12}} />
            </TouchableOpacity>
            <Text style={{fontSize:18, lineHeight:25, color:'#fff'}}>添加银行卡</Text>
            <View style={{flex:1}}></View>
          </View>
        </View>

        <ScrollView style={{flex:1, backgroundColor:'#fff'}}>
          {_.map(this.state.list, o => (
            <View key={o.id} style={{margin:10, borderRadius:5, overflow:'hidden'}}>
              <LinearGradient style={{padding:10}} colors={[ o.start_color || '#FE7735', o.end_color || '#F43F2C']} start={{x:0, y:0.5}} end={{x:1, y:0.5}}>
                <View style={{flexDirection:'row'}}>
                  <View style={{backgroundColor:'#fff', borderRadius:20, padding:5, overflow:'hidden' }}>
                    <Image source={{uri:o.bank_icon}} style={{width:30,height:30 }} />
                  </View>
                  <View style={{marginLeft:10}}>
                    <Text style={{color:'#fff', fontSize:16}}>{o.bank_name}</Text>
                    <Text style={{color:'#fff', fontSize:14}}>储蓄卡</Text>
                  </View>
                </View>

                <Text style={{marginTop:10, marginLeft: 40, color:'#fff'}}>{o.bank_card_no.replace(/(\d{4})\d+(\d{4})/, '$1 **** **** $2')}</Text>
              </LinearGradient>
            </View>
          ))}
          <TouchableOpacity onPress={() => {
            this.props.navigation.navigate('myBankCardCreate')
          }} style={{padding: 10, alignItems:'center', borderWidth:1, borderColor:'#444', borderStyle:'dashed', borderRadius:5, margin: 10}}>
            <Text><Text style={{fontSize:20, color:'#ff4c30'}}>+</Text>添加银行卡</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  async componentDidMount() {

    await this.reload();
  }

  async reload() {
    const list = (await axios.get('/api/my/user_bank_card?status=2')).data;
    this.setState({list});
  }
}

export default withRedux(Screen)
