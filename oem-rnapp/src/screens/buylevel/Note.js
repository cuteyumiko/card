import React, { Component } from 'react';
import {
  Text, View,
  TouchableOpacity, ScrollView,
} from 'react-native';
import { withNavigation } from 'react-navigation';

class Screen extends Component {
  render() {
    return (
      <ScrollView style={{flex: 1}}>
        <View style={{marginBottom:10, padding: 20, backgroundColor:'#ffffff'}}>
          <Text style={{fontSize:15, color:'#000000'}}>{'1、服务内容'}</Text>
          <Text style={{marginTop:10, fontSize:14, color:'#545454'}}>{'购买成功后即可开通代理资格，同时享受查看“首页-Hello学院”所有今日口子、提额技术等其他增值服务。'}</Text>
        </View>

        <View style={{marginBottom:10, padding: 20, backgroundColor:'#ffffff'}}>
          <Text style={{fontSize:15, color:'#000000'}}>{'2、服务条件'}</Text>
          <Text style={{marginTop:10, fontSize:14, color:'#545454'}}>{'HelloCard会员使用权及其附属功能仅限于“HelloCard”公众号和HelloCardAPP，与本公司的其他产品服务不共享。'}</Text>
        </View>

        <View style={{marginBottom:10, padding: 20, backgroundColor:'#ffffff'}}>
          <Text style={{fontSize:15, color:'#000000'}}>{'3、使用权限'}</Text>
          <Text style={{marginTop:10, fontSize:14, color:'#545454'}}>{'HelloCard会员账号仅限本人使用，不得进行转让和出售。'}</Text>
        </View>

        <View style={{marginBottom:10, padding: 20, backgroundColor:'#ffffff'}}>
          <Text style={{fontSize:15, color:'#000000'}}>{'4、不支持退货'}</Text>
          <Text style={{marginTop:10, fontSize:14, color:'#545454'}}>{'本产品属于线上服务类产品，一经购买即享受平台所有功能，不支持退货行为。'}</Text>
        </View>

      </ScrollView>
    );
  }
  componentDidMount() {
  }
}

export default withNavigation(Screen);
