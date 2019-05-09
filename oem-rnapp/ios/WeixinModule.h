//
//  WeixinModule.h
//  bankapp
//
//  Created by 陆民 on 2018/7/31.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#ifndef WeixinModule_h
#define WeixinModule_h

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import "WXApi.h"

@interface WeixinModule : RCTEventEmitter <RCTBridgeModule, WXApiDelegate>
@end


#endif /* WeixinModule_h */
