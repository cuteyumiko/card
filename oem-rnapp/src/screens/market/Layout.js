import React, { Component } from 'react';
import {
  Text, View,
  TouchableOpacity, Image,
  Clipboard,
} from 'react-native';
import { ModalIndicator, Toast } from 'teaset';

import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';

import Card from './Card';
import Loan from './Loan';

import { connect } from 'react-redux'
import { actions } from '../../redux';
const withRedux = connect(
  state => state.app,
  dispatch => ({
  })
);


class Screen extends Component {
  state = {
    idx: 0,
    card_text: '',
    loan_text: '',
  }
  render() {
    return (
      <View style={{flex:1}}>
        <View style={{paddingTop:this.props.marginTop, backgroundColor:'#4959B8'}}>
          <View style={{flexDirection:'row', paddingVertical:10}}>
            <TouchableOpacity style={{flex:1}} onPress={ () => this.props.navigation.pop() }>
              <Image source={require('../../assets/left-arrow-white.png')} style={{height:20, marginLeft: 12}} />
            </TouchableOpacity>
            <Text style={{fontSize:18, lineHeight:25, color:'#fff'}}>产品列表</Text>
            <TouchableOpacity onPress={() => {
              let text = '';
              if(this.state.idx === 0) text = this.state.card_text;
              else if(this.state.idx === 1) text = this.state.loan_text;
              if(text) {
                Clipboard.setString(text);
                Toast.success('链接已全部复制');
              }
            }} style={{flex:1}}>
              <Text style={{marginRight: 12, textAlign:'right', color:'#fff'}}>复制全部</Text>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollableTabView onChangeTab={ ({ i }) => {
          this.setState({idx: i})
        } } style={{flex:1}} initialPage={0} renderTabBar={() => <ScrollableTabBar />} tabBarBackgroundColor='#ffffff' tabBarActiveTextColor='#4959B8' tabBarInactiveTextColor='#333333' tabBarUnderlineStyle={{backgroundColor:'#FEC51D'}}>
          <Card tabLabel='信用卡' ref={ ref => this.card_ref = ref } onCopyText={text => {
            console.log(text);
            this.setState({card_text: text })
          }} />
          <Loan tabLabel='贷款' ref={ ref => this.loan_ref = ref } onCopyText={text => this.setState({loan_text: text })} />
        </ScrollableTabView>
      </View>
    );
  }
  componentDidMount() {
  }
}

export default withRedux(Screen)
