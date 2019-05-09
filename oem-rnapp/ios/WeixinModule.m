//
//  WeixinModule.m
//  bankapp
//
//  Created by 陆民 on 2018/7/31.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

#import <React/RCTConvert.h>
#import "WeixinModule.h"

static NSString *const kOpenURLNotification = @"RCTOpenURLNotification";

@implementation WeixinModule
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
  [WXApi handleOpenURL:url delegate:self];
}

- (void)onResp:(BaseResp *)resp {
  if([resp isKindOfClass:[PayResp class]]){
    PayResp *payResp = (PayResp *)resp;
    
    [self sendEventWithName:@"wxpayreturn" body:@{
                                              @"returnKey": payResp.returnKey,
                                              @"type": [NSNumber numberWithInt:payResp.type],
                                              @"errCode": [NSNumber numberWithInt:payResp.errCode],
                                              @"errStr": payResp.errStr == nil ? NSNull.null : payResp.errStr
                                              }];
  }
}

- (NSArray<NSString *> *)supportedEvents {
  return @[@"wxpayreturn"];
}

RCT_EXPORT_METHOD(sendPayReq: (NSDictionary *) req)
{
  PayReq *request = [[PayReq alloc] init];
  request.partnerId = [RCTConvert NSString:req[@"partnerId"]];
  request.prepayId = [RCTConvert NSString:req[@"prepayId"]];
  request.package = @"Sign=WXPay";
  request.nonceStr = [RCTConvert NSString:req[@"nonceStr"]];
  request.timeStamp = [RCTConvert uint64_t:req[@"timeStamp"]];
  request.sign = [RCTConvert NSString:req[@"sign"]];
  
  [WXApi sendReq: request];
}

RCT_EXPORT_METHOD(sendMessageReq: (NSDictionary *) req)
{
  SendMessageToWXReq* request = nil;
  
  id mediaObject = nil;
  BOOL bText = NO;
  if(req[@"webpageUrl"] != nil) {
    WXWebpageObject* object = [WXWebpageObject object];
    object.webpageUrl = req[@"webpageUrl"];
    mediaObject = object;
    bText = NO;
  }
  
  if(mediaObject != nil) {
    request = [[SendMessageToWXReq alloc] init];
    WXMediaMessage* message = [WXMediaMessage message];
    message.mediaObject = mediaObject;
    message.title = req[@"title"];
    message.description = req[@"description"];
    if(req[@"thumbImage"] != nil) {
      UIImage* image = [UIImage imageWithData:[NSData dataWithContentsOfURL:[NSURL URLWithString:[RCTConvert NSString:req[@"thumbImage"]]]]];
      [message setThumbImage:image];
    }
    
    request.bText = bText;
    request.message = message;
    request.scene = [RCTConvert int:req[@"scene"]];
  }
  
  
  if(request != nil) {
    [WXApi sendReq: request];
  }
}

@end
