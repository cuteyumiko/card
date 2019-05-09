import React, { Component } from 'react';
import {
  View, Image, TouchableOpacity, Text,
} from 'react-native';

import Video from 'react-native-video';

export default class VideoOK extends Component {

  state = {
    videoWidth: 0,
    videoHeight: 0,
    viewWidth: 0,
    viewHeight: 0,
    paused: true,
    showCtrl: false,
  }
  _onLayout = this.onLayout.bind(this)

  onLayout(e) {
    let { width, height } = e.nativeEvent.layout;
    this.setState({viewWidth: width, viewHeight: height });
  }

  getWidth() {
    return this.state.viewWidth;
  }
  getHeight() {
    if(!this.state.videoWidth) return 0;
    return this.state.videoHeight / this.state.videoWidth * this.state.viewWidth;
  }

  render() {
    const { source, ...props } = this.props;
    return (
      <View onLayout={ this._onLayout } {...props}>

        <Video ref={ video => this.video = video }
          source = { source }
          paused = { this.state.paused }
          rate = { 1 }
          resizeMode = 'cover'
          volume={1.0}
          muted={false}
          style={{width: this.getWidth(), height: this.getHeight() }}
          onLoadStart={ () => console.log('onLoadStart')}
          onLoad={ e => {
            const { width, height } = e.naturalSize;
            this.setState({ videoWidth: width, videoHeight: height });
          }}
          onProgress={ () => console.log('onProgress')}
          onEnd={ () => console.log('onEnd')}
          onError={ () => console.log('onError')}
          />
          <View style={{position:'absolute', top:0, left:0, right:0, bottom:0, backgroundColor: this.state.paused ? 'rgba(0, 0, 0, 0.7)': 'transparent'}}>

            {(this.state.paused || this.state.showCtrl) ? (
              <View style={{flex:1,alignItems:'center', justifyContent:'center'}}>
                <TouchableOpacity onPress={ () => {
                  this.setState({ paused: !this.state.paused });
                }}>
                  <Text style={{color:'#fff'}}>{this.state.paused ? '播放' : '暂停'}</Text>
                </TouchableOpacity>
              </View>
            ): (
              <TouchableOpacity style={{flex:1}} onPress={ () => {
                if(this.timeout) clearTimeout(this.timeout);

                this.timeout = setTimeout(() => {
                  this.setState({ showCtrl: false});
                }, 2000);
                this.setState({ showCtrl: true });
              }}>
              </TouchableOpacity>
            )}

          </View>
      </View>)
  }

  componentDidMount() {
  }
}
