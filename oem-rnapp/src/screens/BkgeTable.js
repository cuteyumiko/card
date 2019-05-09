import React, { Component } from 'react';
import {
  Text, View, Image,
  TouchableOpacity, ScrollView,
} from 'react-native';
import { ModalIndicator, Toast } from 'teaset';
import { withNavigation } from 'react-navigation';
import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';
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

const colorArray = [
  '#FFD65E,#FAA414', '#B4EC51,#96C953', '#C2CBDE,#8A9EB9', '#89BDF8,#3485E9', '#8B62FA,#5843E9',
];

class Screen extends Component {

  state = {
    levelList: [],
    cardList: [],
    loanList: [],
    ticketList: [],
  }
  render() {
    return (
      <View style={{flex: 1, backgroundColor:'#ffffff'}}>
        <View style={{paddingTop:this.props.marginTop, backgroundColor:'#4959B8'}}>
          <View style={{flexDirection:'row', paddingVertical:10}}>
            <TouchableOpacity style={{flex:1}} onPress={ () => this.props.navigation.pop() }>
              <Image source={require('../assets/left-arrow-white.png')} style={{height:20, marginLeft: 12}} />
            </TouchableOpacity>
            <Text style={{fontSize:18, lineHeight:25, color:'#fff'}}>佣金表</Text>
            <View style={{flex:1}}></View>
          </View>
        </View>
        <ScrollView>

          {this.state.cardList && this.state.cardList.length ? (
            <View>
              <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                <View style={{width: 8, height: 8, borderRadius: 4, backgroundColor:'#4959B8'}}></View>
                <Text style={{margin: 8, fontSize:15, color:'#4959B8'}}>信用卡佣金表</Text>
                <View style={{width: 8, height: 8, borderRadius: 4, backgroundColor:'#4959B8'}}></View>
              </View>

              <View style={{flexDirection:'row', padding: 15}}>
                <View>
                  <View style={{height:25, backgroundColor:'#5843E9', justifyContent:'center'}}>
                    <Text style={{color:'#ffffff', textAlign:'right', marginLeft:20, marginRight:5, fontSize: 10}}>方案</Text>
                  </View>
                  <View style={{height:25, backgroundColor:'#5843E9', justifyContent:'center'}}>
                    <Text style={{color:'#ffffff', textAlign:'left', marginLeft:5, marginRight:20, fontSize: 10}}>银行</Text>
                  </View>
                  <View style={{height:10}}></View>

                  {_.map(this.state.cardList, o => (
                    <View key={o.id} style={{height:30, alignItems:'center', justifyContent:'center'}}>
                      <Text style={{fontSize:8, color:'#545454'}}>{o.name}</Text>
                      <Text style={{fontSize:8, color:'#545454'}}>{o.tip_text}</Text>
                    </View>
                  ))}
                </View>

                {_.map(this.state.levelList, (o, idx) => (
                  <View key={o.id} style={{flex:1}}>
                    <LinearGradient colors={(colorArray[idx] || 'red,green').split(',')} start={{x:0, y:0.5}} end={{x:1, y:0.5}} style={{height:25, alignItems:'center', justifyContent:'center'}}>
                      <Text style={{color:'#ffffff', fontSize: 10}}>{`LV.NO${idx+1}`}</Text>
                    </LinearGradient>
                    <LinearGradient colors={(colorArray[idx] || 'red,green').split(',')} start={{x:0.5, y:0}} end={{x:0.5, y:1}} style={{height:25, alignItems:'center', justifyContent:'center'}}>
                      <Text style={{color:'#ffffff', fontSize: 10}}>{o.name}</Text>
                    </LinearGradient>
                    <View style={{height:10}}></View>

                    {_.map(this.state.cardList, (p, i) => (
                      <View key={p.id} style={{height:30, alignItems:'center', justifyContent:'center', backgroundColor:i % 2 ? '#F0F1F6' : '#F9FBFF'}}>
                        <Text style={{fontSize:8, color:'#545454'}}>{`${o.card[p.id]}元/单`}</Text>
                      </View>
                    ))}

                  </View>
                ))}

              </View>
            </View>
          ) : null}

          {this.state.loanList && this.state.loanList.length ? (
          <View>
            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
              <View style={{width: 8, height: 8, borderRadius: 4, backgroundColor:'#4959B8'}}></View>
              <Text style={{margin: 8, fontSize:15, color:'#4959B8'}}>贷款佣金表</Text>
              <View style={{width: 8, height: 8, borderRadius: 4, backgroundColor:'#4959B8'}}></View>
            </View>


            <View style={{flexDirection:'row', padding: 15}}>
              <View>
                <View style={{height:25, backgroundColor:'#5843E9', justifyContent:'center'}}>
                  <Text style={{color:'#ffffff', textAlign:'right', marginLeft:20, marginRight:5, fontSize: 10}}>方案</Text>
                </View>
                <View style={{height:25, backgroundColor:'#5843E9', justifyContent:'center'}}>
                  <Text style={{color:'#ffffff', textAlign:'left', marginLeft:5, marginRight:20, fontSize: 10}}>银行</Text>
                </View>

                {_.map(this.state.loanList, o => (
                  <View key={o.id} style={{height:30, alignItems:'center', justifyContent:'center'}}>
                    <Text style={{fontSize:8, color:'#545454'}}>{o.name}</Text>
                    <Text style={{fontSize:8, color:'#545454'}}>{o.tip_text}</Text>
                  </View>
                ))}
              </View>

              {_.map(this.state.levelList, (o, idx) => (
                <View key={o.id} style={{flex:1}}>

                  <LinearGradient colors={(colorArray[idx] || 'red,green').split(',')} start={{x:0, y:0.5}} end={{x:1, y:0.5}} style={{height:25, alignItems:'center', justifyContent:'center'}}>
                    <Text style={{color:'#ffffff', fontSize: 10}}>{`LV.NO${idx+1}`}</Text>
                  </LinearGradient>
                  <LinearGradient colors={(colorArray[idx] || 'red,green').split(',')} start={{x:0.5, y:0}} end={{x:0.5, y:1}} style={{height:25, alignItems:'center', justifyContent:'center'}}>
                    <Text style={{color:'#ffffff', fontSize: 10}}>{o.name}</Text>
                  </LinearGradient>


                  {_.map(this.state.loanList, (p, i) => (
                    <View key={p.id} style={{height:30, alignItems:'center', justifyContent:'center', backgroundColor:i % 2 ? '#F0F1F6' : '#F9FBFF'}}>
                      <Text style={{fontSize:8, color:'#545454'}}> {`${o.loan[p.id]}${p.money_unit}/单`}</Text>
                    </View>
                  ))}

                </View>
              ))}
            </View>
          </View>
          ) : null}

          {this.state.ticketList && this.state.ticketList.length ? (
          <View>
            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
              <View style={{width: 8, height: 8, borderRadius: 4, backgroundColor:'#4959B8'}}></View>
              <Text style={{margin: 8, fontSize:15, color:'#4959B8'}}>积分兑换佣金表</Text>
              <View style={{width: 8, height: 8, borderRadius: 4, backgroundColor:'#4959B8'}}></View>
            </View>


            <View style={{flexDirection:'row', padding: 15}}>
              <View>
                <View style={{height:25, backgroundColor:'#5843E9', justifyContent:'center'}}>
                  <Text style={{color:'#ffffff', textAlign:'right', marginLeft:20, marginRight:5, fontSize: 10}}>方案</Text>
                </View>
                <View style={{height:25, backgroundColor:'#5843E9', justifyContent:'center'}}>
                  <Text style={{color:'#ffffff', textAlign:'left', marginLeft:5, marginRight:20, fontSize: 10}}>银行</Text>
                </View>

                {_.map(this.state.ticketList, o => (
                  <View key={o.id} style={{height:30, alignItems:'center', justifyContent:'center'}}>
                    <Text style={{fontSize:8, color:'#545454'}}>{o.source_name}</Text>
                    <Text style={{fontSize:8, color:'#545454'}}>{o.name}</Text>
                  </View>
                ))}
              </View>

              {_.map(this.state.levelList, (o, idx) => (
                <View key={o.id} style={{flex:1}}>

                  <LinearGradient colors={(colorArray[idx] || 'red,green').split(',')} start={{x:0, y:0.5}} end={{x:1, y:0.5}} style={{height:25, alignItems:'center', justifyContent:'center'}}>
                    <Text style={{color:'#ffffff', fontSize: 10}}>{`LV.NO${idx+1}`}</Text>
                  </LinearGradient>
                  <LinearGradient colors={(colorArray[idx] || 'red,green').split(',')} start={{x:0.5, y:0}} end={{x:0.5, y:1}} style={{height:25, alignItems:'center', justifyContent:'center'}}>
                    <Text style={{color:'#ffffff', fontSize: 10}}>{o.name}</Text>
                  </LinearGradient>


                  {_.map(this.state.ticketList, (p, i) => (
                    <View key={p.id} style={{height:30, alignItems:'center', justifyContent:'center', backgroundColor:i % 2 ? '#F0F1F6' : '#F9FBFF'}}>
                      <Text style={{fontSize:8, color:'#545454'}}> {`${o.ticket[p.id]}/单`}</Text>
                    </View>
                  ))}

                </View>
              ))}
            </View>
          </View>
          ) : null}

        </ScrollView>

      </View>
    );
  }
  async componentDidMount() {

    const [levelList, cardList, loanList, ticketList, user_level_x_product_card, user_level_x_product_loan, user_level_x_product_ticket] = (await axios.post('/api/v2/object', [
      JSON.stringify({ object: 'user_level', method: 'filter', query: { merchant_id: this.props.merchant.id, order: 'value'} }),
      JSON.stringify({ object: 'product_card_with_merchant', method: 'filter', query: { merchant_id: this.props.merchant.id, is_enabled: 1, is_recommend: 1, order: 'sort'}}),
      JSON.stringify({ object: 'product_loan_with_merchant', method: 'filter', query: { merchant_id: this.props.merchant.id, is_enabled: 1, order: 'sort'}}),
      JSON.stringify({ object: 'product_ticket_with_merchant', method: 'filter', query: { merchant_id: this.props.merchant.id}}),
      JSON.stringify({ object: 'user_level_x_product_card', method: 'filter', query: { merchant_id: this.props.merchant.id }}),
      JSON.stringify({ object: 'user_level_x_product_loan', method: 'filter', query: { merchant_id: this.props.merchant.id }}),
      JSON.stringify({ object: 'user_level_x_product_ticket', method: 'filter', query: { merchant_id: this.props.merchant.id }}),
    ])).data;

    for(let i = 0; i < levelList.length; i++) {
      levelList[i].card = _(user_level_x_product_card).filter({level_id: levelList[i].id}).mapKeys('card_id').mapValues('money').value();
      levelList[i].loan = _(user_level_x_product_loan).filter({level_id: levelList[i].id}).mapKeys('loan_id').mapValues('money').value();
      levelList[i].ticket = _(user_level_x_product_ticket).filter({level_id: levelList[i].id}).mapKeys('ticket_id').mapValues('money').value();
    }

    this.setState({ levelList, cardList, loanList, ticketList });
  }
}

export default withRedux(withNavigation(Screen));
