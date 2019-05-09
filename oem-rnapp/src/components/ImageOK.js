import React, { Component } from 'react';
import {
  View, Image,
} from 'react-native';

export default class ImageOK extends Component {

  state = {
    imageWidth: 0,
    imageHeight: 0,
    viewWidth: 0,
    viewHeight: 0,
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
    if(!this.state.imageWidth) return 0;
    return this.state.imageHeight / this.state.imageWidth * this.state.viewWidth;
  }
  render() {
    return <View onLayout={ this._onLayout }>
      <Image source={this.props.source} style={{width: this.getWidth(), height: this.getHeight() }} />
    </View>
  }

  componentDidMount() {
    const { source = {}, width, height } = this.props;
    const { uri } = source;

    if (uri) {
      Image.getSize(uri, (width, height) => {
        this.setState({ imageWidth: width, imageHeight: height });
      })
    }
  }
}
