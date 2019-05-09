import React, { Component } from 'react';
import {
  Text, View, TextInput,
  TouchableOpacity, Image, ScrollView,
} from 'react-native';
import { ModalIndicator, Toast } from 'teaset';

import { withNavigation } from 'react-navigation';

import _ from 'lodash';
import axios from 'axios';

import { connect } from 'react-redux'
import { actions } from '../redux';
const withRedux = connect(
  state => state.app,
  dispatch => ({
    setUser: (user) => dispatch(actions.app.setUser(user)),
    setBankCardId: (bankCardId) => dispatch(actions.app.setBankCardId(bankCardId)),
    setBankCardList: (bankCardList) => dispatch(actions.app.setBankCardList(bankCardList)),
  })
);

class Screen extends Component {
  state = {
    money: 0,
    list: [],
  }
  render() {
    const bankCard = this.bankCard();
    return (
      <View style={{flex: 1}}>
        <View style={{paddingTop:this.props.marginTop, backgroundColor:'#4959B8'}}>
          <View style={{flexDirection:'row', paddingVertical:10}}>
            <TouchableOpacity style={{flex:1}} onPress={ () => this.props.navigation.pop() }>
              <Image source={require('../assets/left-arrow-white.png')} style={{height:20, marginLeft: 12}} />
            </TouchableOpacity>
            <Text style={{fontSize:18, lineHeight:25, color:'#fff'}}>提现</Text>
            <View style={{flex:1}}></View>
          </View>
        </View>

        <View style={{backgroundColor:'#4959B8', padding:20}}>
          <View style={{flexDirection:'row'}}>
            <Text style={{flex:1, fontSize:14, lineHeight:20, color:'#FFFFFF'}}>可用余额(元)</Text>
            <Text style={{fontSize:30, lineHeight:35, color:'#FFFFFF'}}>{this.props.user.balance}</Text>
          </View>
          <View style={{flexDirection:'row', marginTop:22}}>
            <View style={{flex:1}}>
              <Text style={{fontSize:14, lineHeight:20, color:'#FFFFFF'}}>可提现金额(元)</Text>
              <Text style={{fontSize:30, lineHeight:35, color:'#FFFFFF'}}>{this.props.user.balance}</Text>
            </View>
            <TouchableOpacity onPress={() => this.setState({money: `${this.props.user.balance}`})} style={{justifyContent:'center'}}>
              <Text style={{fontSize:15, lineHeight:21, color:'#FFEE0F'}}>全部提现</Text>
            </TouchableOpacity>
          </View>
        </View>


        <Text style={{marginTop:20, fontSize:15, lineHeight:21, color:'#9C9C9C', marginLeft:20}}>请选择银行卡</Text>

        <TouchableOpacity onPress={() => this.props.navigation.navigate('selectBankCard')} style={{flexDirection:'row', marginTop:10, backgroundColor:'#fff', paddingHorizontal:20, paddingVertical:14}}>
          {bankCard ? (
            <View style={{flexDirection:'row'}}>
              <Image source={{uri:bankCard.bank_icon}} style={{width:30,height:30}} />
              <View style={{marginLeft:20}}>
                <Text style={{fontSize:15, lineHeight:21, color:'#333333'}}>{bankCard.bank_name}(尾号{bankCard.bank_card_no.substr(-4)})</Text>
                <Text style={{fontSize:13, lineHeight:18, color:'#9C9C9C'}}>单笔限额50万元，每日限额200万元</Text>
              </View>
            </View>
          ) : (
            <View>
              <Text>请选择银行</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={{marginTop:10, backgroundColor:'#fff', padding: 20}}>
          <Text style={{fontSize:15, lineHeight:21, color:'#333333'}}>提现金额</Text>
          <TextInput value={this.state.money} onChangeText={money => this.setState({ money })} style={{marginTop:2, color:'#9C9C9C'}} placeholder='请输入提现金额' underlineColorAndroid='transparent'/>
        </View>

        <Text style={{marginTop:5, fontSize:12, lineHeight:17, color:'#F5A623', marginHorizontal:20}}>{'提现说明：每日18点前到账，18点后提现次日到账，手续费每笔2元'}</Text>

        {bankCard ? (
          <TouchableOpacity style={{borderRadius:5, marginTop:10,justifyContent:'center', backgroundColor:'#3C86FE', height:48, marginLeft:30, marginRight:30}} onPress={() => this.handleSubmit()} >
            <Text style={{textAlign:'center', color:'#fff', fontSize:15}}>提交</Text>
          </TouchableOpacity>
        ): null}
      </View>
    );
  }
  bankCard() {
    if(!this.props.bankCardId) return null;
    return _.find(this.props.bankCardList, { id: this.props.bankCardId });
  }
  async componentDidMount() {
    const list = (await axios.get('/api/v2/user_bank_card', { params: {
      status: 2, creator_id: this.props.user.id,
    } })).data;

    this.props.setBankCardList(list);

    let { bankCardId } = this.props;

    if(!bankCardId && list.length) {
      bankCardId = list[0].id;
      this.props.setBankCardId(bankCardId);
    }
  }

  async handleSubmit() {
    const form = _.pick(this.bankCard(), ['mobile', 'bank_card_name', 'bank_name', 'bank_card_no']);
    form.money = this.state.money;

    try {

      ModalIndicator.show('提交中');
      await axios.post('/api/cash_order', form);

      const { user } = (await axios.get('/api/token_info')).data;
      this.props.setUser(user);
      ModalIndicator.hide();
      Toast.success('申请已提交成功');
      this.props.navigation.pop();

    } catch (e) {
      ModalIndicator.hide();
      const message = e.response ? e.response.data : e.message;
      Toast.fail(message);
    }

  }
}

export default withRedux(withNavigation(Screen))
