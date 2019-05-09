import React, { Component } from 'react';
import {
  Text, View, Modal, Linking,
  TouchableOpacity, Image, ScrollView, Alert,
} from 'react-native';
import { withNavigation } from 'react-navigation';

import LinearGradient from 'react-native-linear-gradient';
import Swiper from 'react-native-swiper';

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
    cardList: [],
    loanList: [],
    ticketSourceList: [],
    noticeList: [],
    lunboList: [],
    showAuthVisible: false,
  }

  render() {
    return (
      <ScrollView style={{flex: 1, backgroundColor:'#fff'}}>

        <View style={{height:180}}>
          {this.state.lunboList.length ? (
            <Swiper height={180} autoplay={true} showsPagination={false}>

              {_.map(this.state.lunboList, o => (
                <TouchableOpacity key={o.id} onPress={() => {
                  if (o.href) {
                    Linking.openURL(o.href);
                  } else {
                    this.props.navigation.navigate('collegeDetail', { id: o.id})
                  }
                }} style={{flex:1, justifyContent:'center'}}>
                  <Image source={{uri:o.icon}} style={{height:180}} />
                </TouchableOpacity>
              ))}
            </Swiper>
          ) : null}
        </View>
        <View style={{marginTop:10, height:40, borderRadius:20, borderColor:'#E2E2E2', borderWidth:1, marginHorizontal:15, paddingHorizontal:10}}>
          {this.state.noticeList.length ? (
            <Swiper height={30} autoplay={true} showsPagination={false} horizontal={false}>

              {_.map(this.state.noticeList, o => (
                <TouchableOpacity key={o.id} onPress={() => this.props.navigation.navigate('notice_detail', { id: o.id })} style={{flex:1, justifyContent:'center'}}>
                  <Text style={{color:'#B0B7CA'}} numberOfLines={1}>{o.name}</Text>
                </TouchableOpacity>
              ))}
            </Swiper>
          ) : null}
        </View>

        {this.props.merchant.extend.app_loan_hide === '0' ? (
          <View style={{paddingVertical: 19, paddingHorizontal:10}}>
            <View style={{flexDirection:'row', }}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('product', { initialPage: 'card'})} style={{flex:1, alignItems:'center'}}>
                <Image source={require('../assets/home-icon-card.png')} style={{width:50}} />
                <Text style={{marginTop:5, fontSize:14, lineHeight:20, color:'#4A4A4A'}}>信用卡</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('product', { initialPage: 'loan'})} style={{flex:1, alignItems:'center'}}>
                <Image source={require('../assets/home-icon-loan.png')} style={{width:50}} />
                <Text style={{marginTop:5, fontSize:14, lineHeight:20, color:'#4A4A4A'}}>贷款</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('product', { initialPage: 'ticket'})} style={{flex:1, alignItems:'center'}}>
                <Image source={require('../assets/home-icon-ticket.png')} style={{width:50}} />
                <Text style={{marginTop:5, fontSize:14, lineHeight:20, color:'#4A4A4A'}}>积分兑换</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Alert.alert('敬请期待')} style={{flex:1, alignItems:'center'}}>
                <Image source={require('../assets/home-icon-loan-off.png')} style={{width:50}} />
                <Text style={{marginTop:5, fontSize:14, lineHeight:20, color:'#4A4A4A'}}>{'线下贷款'}</Text>
              </TouchableOpacity>
            </View>
            <View style={{flexDirection:'row', marginTop:20}}>
              <TouchableOpacity onPress={() => Alert.alert('敬请期待')} style={{flex:1, alignItems:'center'}}>
                <Image source={require('../assets/home-icon-credit.png')} style={{width:50}} />
                <Text style={{marginTop:5, fontSize:14, lineHeight:20, color:'#4A4A4A'}}>{'同盾征信'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('train')} style={{flex:1, alignItems:'center'}}>
                <Image source={require('../assets/home-icon-train.png')} style={{width:50}} />
                <Text style={{marginTop:5, fontSize:14, lineHeight:20, color:'#4A4A4A'}}>{'推广培训'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('buyLevel')} style={{flex:1, alignItems:'center'}}>
                <Image source={require('../assets/home-icon-vip.png')} style={{width:50}} />
                <Text style={{marginTop:5, fontSize:14, lineHeight:20, color:'#4A4A4A'}}>{'购买会员'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Alert.alert('敬请期待')} style={{flex:1, alignItems:'center'}}>
                <Image source={require('../assets/home-icon-coop.png')} style={{width:50}} />
                <Text style={{marginTop:5, fontSize:14, lineHeight:20, color:'#4A4A4A'}}>{'签到积分'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ): (
          <View style={{paddingVertical: 19, paddingHorizontal:10}}>
            <View style={{flexDirection:'row', }}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('product', { initialPage: 'card'})} style={{flex:1, alignItems:'center'}}>
                <Image source={require('../assets/home-icon-card.png')} style={{width:50}} />
                <Text style={{marginTop:5, fontSize:14, lineHeight:20, color:'#4A4A4A'}}>信用卡</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('product', { initialPage: 'ticket'})} style={{flex:1, alignItems:'center'}}>
                <Image source={require('../assets/home-icon-ticket.png')} style={{width:50}} />
                <Text style={{marginTop:5, fontSize:14, lineHeight:20, color:'#4A4A4A'}}>积分兑换</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('train')} style={{flex:1, alignItems:'center'}}>
                <Image source={require('../assets/home-icon-train.png')} style={{width:50}} />
                <Text style={{marginTop:5, fontSize:14, lineHeight:20, color:'#4A4A4A'}}>{'推广培训'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Alert.alert('敬请期待')} style={{flex:1, alignItems:'center'}}>
                <Image source={require('../assets/home-icon-coop.png')} style={{width:50}} />
                <Text style={{marginTop:5, fontSize:14, lineHeight:20, color:'#4A4A4A'}}>{'签到积分'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) }




        <View>
          <View style={{height:5, backgroundColor:'#eee'}}></View>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('product', { initialPage: 'card'})} style={{flexDirection:'row', paddingHorizontal:15, paddingVertical:10, borderBottomWidth:0.5, borderColor:'#eee', alignItems:'center'}}>
            <Image source={require('../assets/tuijian.png')} style={{height:20}} />
            <View style={{flex:1, marginLeft:5}}><Text style={{fontSize:15, lineHeight:21, color:'#4A4A4A'}}>信用卡推荐</Text></View>
            <View>
              <Image source={require('../assets/more.png')} style={{height:15}} />
            </View>
          </TouchableOpacity>

          <View style={{flexDirection:'row', padding: 20}}>
            {_.map(this.state.cardList, o => (
              <TouchableOpacity key={o.id} onPress={() => this.props.navigation.navigate('cardApply', { id: o.id})} key={o.id} style={{flex:1, alignItems:'center'}}>
                <Image source={{uri: o.property.card_image || o.icon}} style={{width:85, height:55}} />
                <Text style={{marginTop:11,fontSize:14,color:'#333333'}}>{o.property.card_name || o.name}</Text>
                <Text style={{marginTop:2,fontSize:12,color:'#999999'}}>{o.property.card_desc || o.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {this.props.merchant.extend.app_loan_hide === '0' ? (
          <View>
            <View style={{height:5, backgroundColor:'#eee'}}></View>

            <TouchableOpacity onPress={() => this.props.navigation.navigate('product', { initialPage: 'loan'})} style={{flexDirection:'row', paddingHorizontal:15, paddingVertical:10, borderBottomWidth:0.5, borderColor:'#eee', alignItems:'center'}}>
              <Image source={require('../assets/tuijian.png')} style={{height:20}} />
              <View style={{flex:1, marginLeft:5}}><Text style={{fontSize:15, lineHeight:21, color:'#4A4A4A'}}>贷款推荐</Text></View>
              <View>
                <Image source={require('../assets/more.png')} style={{height:15}} />
              </View>
            </TouchableOpacity>

            <View style={{flexDirection:'row', flexWrap:'wrap', marginTop: 10, padding: 5}}>
              {_.map(this.state.loanList, o => (
                <View key={o.id} style={{width: '50%', padding: 3}}>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('loanApply', { id: o.id})} style={{alignItems:'center', flexDirection:'row', borderWidth: 0.5, borderColor: '#eee', borderRadius: 5, padding: 6}}>
                    <Image source={{uri:o.icon}} style={{height:40, width:40}} />
                    <View style={{flex:1, marginLeft:6}}>
                      <View style={{marginTop:5}}>
                        <Text style={{color:'#333333', fontSize:15}}>{o.name}</Text>
                      </View>

                      <Text style={{color:'#999999', fontSize:12, marginTop:2}}>额度: {o.quota}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <View>
          <View style={{height:5, backgroundColor:'#eee'}}></View>

          <TouchableOpacity onPress={() => this.props.navigation.navigate('product', { initialPage: 'ticket'})} style={{flexDirection:'row', paddingHorizontal:15, paddingVertical:10, borderBottomWidth:0.5, borderColor:'#eee', alignItems:'center'}}>
            <Image source={require('../assets/home-ticket.png')} style={{height:20}} />
              <View style={{flex:1, marginLeft:5}}><Text style={{fontSize:15, lineHeight:21, color:'#4A4A4A'}}>积分兑换</Text></View>
            <View>
              <Image source={require('../assets/more.png')} style={{height:15}} />
            </View>
          </TouchableOpacity>

          {_.map(this.state.ticketSourceList, o => (
            <TouchableOpacity key={o.id} onPress={() => this.props.navigation.navigate('ticketSource1', { source_id: o.id})} style={{overflow: 'hidden', borderTopLeftRadius: 10, borderTopRightRadius: 10, marginTop: 10, marginLeft: 10, marginRight: 10}}>
              <LinearGradient colors={[ o.property.start_color || '#FE7735', o.property.end_color || '#F43F2C']} start={{x:0, y:0.5}} end={{x:1, y:0.5}} style={{flexDirection:'row', paddingRight: 15}}>
                <View style={{padding:7, backgroundColor:'#fff', borderRadius:40, margin: 15}}>
                  <Image source={{uri:o.icon}} style={{width:35, height:35}} />
                </View>
                <View style={{flex:1}}>
                  <View style={{marginTop: 20, flexDirection:'row', alignItems: 'flex-end'}}>
                    <Text style={{flex:1,fontSize:17, color: '#fff'}}>{o.name}</Text>
                    <View style={{backgroundColor:'#fff', justifyContent:'center', paddingHorizontal:6, paddingVertical:2, borderRadius:20}}>
                      <Text style={{color:o.property.end_color || '#F43F2C', fontSize:13, lineHeight:17}}>立即兑换</Text>
                    </View>
                  </View>

                  <View style={{marginTop:7, flexDirection:'row'}}>
                    <Text style={{flex:1, fontSize: 12, color: '#fff'}}>{'兑换积分：6564分起'}</Text>
                    <Text style={{fontSize: 12, color: '#fff'}}>{'结算时间：秒到'}</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        <Modal visible={this.state.showAuthVisible} transparent animationType='fade'>

          <View style={{flex:1,alignItems:'center', justifyContent:'center', backgroundColor:'rgba(16, 16, 16, 0.7)'}}>
            <View style={{width:'80%'}}>
              <View style={{marginTop: 27, backgroundColor:'#fff', borderRadius: 16, paddingHorizontal: 15, overflow:'visible'}}>

                <View style={{paddingVertical:10}}>
                  <Text style={{fontSize:18, lineHeight:25, textAlign:'center'}}>你还未完善个人资料！</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                  <TouchableOpacity onPress={async () => {
                    this.setState({showAuthVisible: false});
                    this.props.navigation.navigate('myInfo')
                  }} style={{flex:1, padding:10}}>
                    <Text style={{textAlign:'center'}}>去完善</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.setState({showAuthVisible: false})} style={{flex:1, padding:10}}>
                    <Text style={{textAlign:'center'}}>取消</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

        </Modal>
      </ScrollView>
    );
  }
  async componentDidMount() {

    const [cardList, loanList, ticketSourceList, noticeList, lunboList] = (await axios.post('/api/v2/object', [
      JSON.stringify({ object: 'product_card_with_merchant', method: 'filter', query: { merchant_id: this.props.merchant.id, is_enabled: 1, type_code__like: '[app_home]', order: 'sort', prop: 'property', limit: 3} }),
      JSON.stringify({ object: 'product_loan_with_merchant', method: 'filter', query: { merchant_id: this.props.merchant.id, is_enabled: 1, type_code__like: '[app_home]', order: 'sort'} }),
      JSON.stringify({ object: 'product_ticket_source', method: 'filter', query: { is_enabled: 1, is_home: 1, prop: 'property' } }),
      JSON.stringify({ object: 'merchant_notice', method: 'filter', query: { merchant_id: this.props.merchant.id, type_code: 'text-marquee' } }),
      JSON.stringify({ object: 'course', method: 'filter', query: { merchant_id: this.props.merchant.id, type_code: 'home_lunbo' } }),
    ])).data;


    if(this.props.user.status !== 2) {
      this.setState({showAuthVisible: true})
    }

    this.setState({
      cardList: _.map(cardList, o => ({
        ...o,
        property: _(o.property).mapKeys('property_code').mapValues('value').value(),
      })),
      loanList,
      ticketSourceList: _.map(ticketSourceList, o => ({
        ...o,
        property: _(o.property).mapKeys('property_code').mapValues('value').value(),
      })), noticeList, lunboList
    });
  }
}

export default withRedux(withNavigation(Screen))
