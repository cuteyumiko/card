import React, { Component } from 'react';
import {
  Text, View, Image, Linking,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import entities from 'entities';

import HTMLView from 'react-native-htmlview';
import ImageOK from './ImageOK';
import VideoOK from './VideoOK';
import LoanItem from './LoanItem';
import CardItem from './CardItem';

import _ from 'lodash';
import axios from 'axios';
const UrlParse = require('url-parse');

const { height: D_HEIGHT, width: D_WIDTH } = Dimensions.get('window');

class HtmlImage extends Component {
  state = {
    width: D_WIDTH,
    height: 100,
  }
  render() {
    return <Image source={this.props.source} style={[this.props.style, { width:this.state.width, height:this.state.height }]} />
  }
  componentDidMount() {
    const default_width = D_WIDTH;
    const default_height = 100;
    const { source = {}, width, height } = this.props;
    const { uri } = source;

    let image_width = 0;
    let image_height = 0;
    let percent_width = 0;
    let percent_height = 0;

    if (/^\d+%$/.test(width)) {
      percent_width = parseFloat(width.match(/^(\d+)%$/)[1]) / 100;
    } else if(/^\d+$/.test(width)) {
      image_width = parseInt(width);
    } else {
      image_width = default_width;
    }

    if (/^\d+%$/.test(height)) {
      percent_height = parseFloat(height.match(/^(\d+)%$/)[1]) / 100;
    } else if(/^\d+$/.test(height)) {
      image_height = parseInt(height);
    } else {
      image_height = default_height;
    }

    this.setState({width: image_width || default_width, height: image_height || default_height });

    if (uri && (percent_width || percent_height)) {
      Image.getSize(uri, (width, height) => {
        this.setState({width: default_width * percent_width, height: height / width * (default_width * percent_width)});
      })
    }
  }
}

export default class extends Component {

  render() {
    const { html, ...props } = this.props;
    if(!html) return null;
    return <HTMLView value={html} {...props} renderNode={(node, index, siblings, parent, defaultRenderer) => {
      if(node.type === 'text') {
        const text = _.trim(entities.decodeHTML(node.data));
        if(!text) return null;

        const tag_style = {
          'span': 'color:#fff',
          'h2': 'font-size:22px; line-height:32px',
          'h3': 'font-size:15px; line-height:21px',
          'strong': 'font-weight: bold',
        }
        const class_style= {
          'ql-align-justify': 'text-align:justify',
        }
        const style_map = {
          'font-size' : {
            'medium': '16px',
            'large': '18px',
          },
        }
        let reduceStyle = {};
        let parent = node.parent;
        while(parent) {
          const tag_name = parent.name;
          const classList = parent.attribs.class ? parent.attribs.class.split(' ') : [];
          const style = [
            ..._.map(classList, o => class_style[o]),
            tag_style[tag_name] ? tag_style[tag_name] : '',
            parent.attribs.style,
          ].join(';');
          reduceStyle = {
            ...(style ? _(style.split(';')).filter(o => _.trim(o.split(':')[0])).mapKeys(o => _.trim(o.split(':')[0])).mapValues(o => _.trim(o.split(':')[1])).value() : {}),
            ...reduceStyle,
          }

          parent = parent.parent;
        }

        reduceStyle = {
          ...({'font-size': '12px', 'line-height': '16px', 'color': '#2c3e50'}),
          ...reduceStyle,
        }

        const style = {
          ...(reduceStyle['background-color'] ? { backgroundColor: reduceStyle['background-color']} : {}),
          ...(reduceStyle['color'] ? { color: reduceStyle['color']} : {}),
          ...(reduceStyle['text-align'] ? { textAlign: reduceStyle['text-align']} : {}),
          ...(reduceStyle['font-size'] ? { fontSize: parseFloat(style_map['font-size'][reduceStyle['font-size']] || reduceStyle['font-size'])} : {}),
          ...(reduceStyle['line-height'] ? { lineHeight: parseFloat(reduceStyle['line-height'])} : {}),
          ...(reduceStyle['font-weight'] ? { fontWeight: reduceStyle['font-weight']} : {}),
        }

        return <Text key={index} style={style}>{text}</Text>
      } else if(node.type === 'tag') {
        if(node.name == 'img') {
          const { src, width, height } = node.attribs;
          return <ImageOK key={index} source={{uri: src}} width={width} height={height} />
        } else if(['p', 'br', 'div'].indexOf(node.name) !== -1) {
          return (<View key={index} style={{ minHeight:15}}>{defaultRenderer(node.children, parent)}</View>)
        } else if(['h2', 'h3', 'h4', 'section'].indexOf(node.name) !== -1) {
          return (<View key={index}>{defaultRenderer(node.children, parent)}</View>)
        } else if(['strong', 'span'].indexOf(node.name) !== -1) {
          return (<View key={index}>{defaultRenderer(node.children, parent)}</View>);
        } else if(node.name === 'video') {
          const source = _.find(node.children, { name: 'source' })
          if(!source) return <Text key={index}>video 标签缺少 source</Text>
          const src = source.attribs.src;
          if(!src) return <Text key={index}>source 标签缺少 src 属性</Text>
          return <VideoOK key={index} source={{uri: src, type:'mp4'}} />
        } else if(node.name === 'a') {
          const href = node.attribs.href;
          if(!href) return <Text key={index}>a 标签缺少 href 属性</Text>

          const url = UrlParse(href, true);
          if((!url.host || url.origin === axios.defaults.baseURL) && url.pathname === '/product_loan_apply' && url.query.id) {
            return <LoanItem key={index} id={url.query.id} />
          }

          if((!url.host || url.origin === axios.defaults.baseURL) && url.pathname === '/product_card_apply' && url.query.id) {
            return <CardItem key={index} id={url.query.id} />
          }

          return (<TouchableOpacity key={index} onPress={() => Linking.openURL(href)}>
              {defaultRenderer(node.children, parent)}
              <Text>{JSON.stringify(UrlParse(href, true))}</Text>
            </TouchableOpacity>);
        } else {
          return (<View key={index} style={{backgroundColor:'red'}}>
            <Text style={{color:'#fff'}}>未知的标签{node.name}</Text>
          </View>)
        }
      }

    }} />
  }
}
