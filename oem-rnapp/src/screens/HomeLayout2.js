import React, { Component } from 'react';
import {
  Text, View,
  TouchableOpacity, Image, ScrollView,
} from 'react-native';

import { createBottomTabNavigator } from 'react-navigation';
import Home from './Home';
import Product from './product/Layout';
import Market from './Market';
import Forum from './forum/Layout';
import My from './my/Layout';

export default createBottomTabNavigator({
  home: {
    screen: Home,
    navigationOptions: {
      tabBarLabel: '首页',
      tabBarIcon: ({ focused }) => {
        return <Image source={focused ? require('../assets/tabbar-home-focused.png') : require('../assets/tabbar-home.png')} />
      }
    }
  },
  product: {
    screen: Product,
    navigationOptions: {
      tabBarLabel: '产品',
      tabBarIcon: ({ focused }) => {
        return <Image source={focused ? require('../assets/tabbar-product-focused.png') : require('../assets/tabbar-product.png')} style={{width:24}} />
      }
    }
  },
  my: {
    screen: My,
    navigationOptions: {
      tabBarLabel: '我的',
      tabBarIcon: ({ focused }) => {
        return <Image source={focused ? require('../assets/tabbar-my-focused.png') : require('../assets/tabbar-my.png')} style={{width:24}} />
      }
    }
  },
},{
  initialRouteName: 'home',
})
