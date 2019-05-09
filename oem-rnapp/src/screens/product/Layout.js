import React, { Component } from 'react';
import {
  Text, View,
  TouchableOpacity,
} from 'react-native';

import { withNavigation } from 'react-navigation';

import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';

import { connect } from 'react-redux'
import { actions } from '../../redux';

const reduxWrap = connect(
  state => state.app,
  dispatch => ({
  })
);

import Card from './Card';
import Loan from './Loan';
import TicketSource from './TicketSource';
import OilCard from './OilCard';

class Screen extends Component {
  state = {
    initialPage: 0
  }
  render() {
    return (
      <View style={{flex:1, paddingTop:this.props.marginTop, backgroundColor:'#4959B8'}}>
        <ScrollableTabView locked={true} style={{flex:1}} page={this.state.initialPage} renderTabBar={() => <ScrollableTabBar />} tabBarBackgroundColor='#4959B8' tabBarActiveTextColor='#FEC51D' tabBarInactiveTextColor='#fff' tabBarUnderlineStyle={{height:0}}>
          <Card tabLabel='信用卡' />
          {this.props.merchant.extend.app_loan_hide === '0' ? (
            <Loan tabLabel='贷款' />
          ): null}
          <TicketSource tabLabel='积分兑换' />
        </ScrollableTabView>
      </View>
    );
  }
  componentWillReceiveProps(nextProps) {
    const initialPage = this.props.navigation.state.params ? this.props.navigation.state.params.initialPage : 'card';
    const nextInitialPage = nextProps.navigation.state.params ? nextProps.navigation.state.params.initialPage : 'card';
    if(initialPage !== nextInitialPage) {
      const map = {
        card: 0,
        loan: 1,
        ticket: 2,
      };

      this.setState({ initialPage: map[nextInitialPage]})
    }
  }
  componentDidMount() {
    let initialPage = 'card';
    if(this.props.navigation.state.params) {
      initialPage = this.props.navigation.state.params.initialPage;
    }


    const map = {
      card: 0,
      loan: 1,
      ticket: 2,
    };
    console.log(map[initialPage]);
    this.setState({ initialPage: map[initialPage]})
  }
}

export default reduxWrap(withNavigation(Screen));
