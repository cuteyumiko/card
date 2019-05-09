import React, { Component } from 'react';
import {
  Text, View, TextInput, Modal,
  TouchableOpacity, Image, ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import _ from 'lodash';
import axios from 'axios';

import { connect } from 'react-redux'
import { actions } from '../../redux';
import ImageOK from '../../components/ImageOK';

const withRedux = connect(
  state => state.app,
  dispatch => ({
  })
);

class Screen extends Component {

  state = {
    item: null,
    itemList: [],
  }
  render() {
    if(!this.state.item) return <View style={{flex:1, backgroundColor:'#fff'}} />;

    return (
      <View style={{flex: 1}}>
        <View style={{paddingTop:this.props.marginTop, backgroundColor:'#4959B8'}}>
          <View style={{flexDirection:'row', paddingVertical:10}}>
            <TouchableOpacity style={{flex:1}} onPress={ () => this.props.navigation.pop() }>
              <Image source={require('../../assets/left-arrow-white.png')} style={{height:20, marginLeft: 12}} />
            </TouchableOpacity>
            <Text style={{fontSize:18, lineHeight:25, color:'#fff'}}>积分兑换</Text>
            <View style={{flex:1}}></View>
          </View>
        </View>

        {this.state.item ? (
          <View style={{flex:1}}>
            <ScrollView style={{flex: 1}}>
              <ImageOK source={{uri: this.state.item.image_description}} />
            </ScrollView>
            <View style={{position:'absolute', bottom: 0, left:0, right:0, paddingBottom: this.props.marginBottom, backgroundColor:'transparent'}}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('ticketApply', { id: this.props.navigation.state.params.id})} style={{backgroundColor:'#FF300F', paddingVertical:13, marginHorizontal: 50, borderRadius:50, alignItems:'center'}}>
                <Text style={{fontSize: 17, lineHeight: 24, color: '#fff'}}>报单</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </View>
    );
  }

  async componentDidMount() {
    const { id, source_id } = this.props.navigation.state.params;
    const item = (await axios.get(`/api/product_ticket_source/${source_id}`)).data;

    this.setState({ item });
  }
}

export default withRedux(Screen)
