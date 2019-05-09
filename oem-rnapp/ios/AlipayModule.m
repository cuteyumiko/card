//
//  AlipayModule.m
//  bankapp
//
//  Created by 陆民 on 2018/7/31.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

#import <AlipaySDK/AlipaySDK.h>

#import "AlipayModule.h"

static NSString *const kOpenURLNotification = @"RCTOpenURLNotification";

@implementation AlipayModule
RCT_EXPORT_MODULE();

- (instancetype)init
{
  self = [super init];
  if (self) {
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(handleOpenURL:) name:kOpenURLNotification object:nil];
  }
  return self;
}

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

- (void)handleOpenURL:(NSNotification *) notification {
  NSString *urlString = notification.userInfo[@"url"];
  NSURL *url = [NSURL URLWithString:urlString];

  if([url.host isEqualToString:@"safepay"]) {
    [[AlipaySDK defaultService] processOrderWithPaymentResult:url standbyCallback:^(NSDictionary *resultDic) {
      [self sendEventWithName:@"alipayreturn" body:resultDic];
    }];
  }
}

- (NSArray<NSString *> *)supportedEvents {
  return @[@"alipayreturn"];
}

RCT_EXPORT_METHOD(payOrder: (NSString *) orderString callback: (RCTResponseSenderBlock) callback)
{
  NSString *appScheme = @"hellocard";

  [[AlipaySDK defaultService] payOrder:orderString fromScheme:appScheme callback:^(NSDictionary *resultDic) {
    callback(@[resultDic]);
  }];
}

@end
