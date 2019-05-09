package com.hello.app;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.UrlQuerySanitizer;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.tencent.mm.opensdk.modelbase.BaseResp;
import com.tencent.mm.opensdk.modelmsg.SendMessageToWX;
import com.tencent.mm.opensdk.modelmsg.WXMediaMessage;
import com.tencent.mm.opensdk.modelmsg.WXWebpageObject;
import com.tencent.mm.opensdk.modelpay.PayReq;
import com.tencent.mm.opensdk.modelpay.PayResp;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;

import java.io.IOException;
import java.net.URL;
import java.net.URLConnection;


public class WeixinModule extends ReactContextBaseJavaModule {

    private IWXAPI api;

    static public WeixinModule instance = null;

    public WeixinModule(ReactApplicationContext reactContext) {
        super(reactContext);
        String app_id = reactContext.getResources().getString(R.string.wx_app_id);
        api = WXAPIFactory.createWXAPI(reactContext, null);
        api.registerApp(app_id);
        instance = this;
    }

    @Override
    public String getName() {
        return "WeixinModule";
    }

    @ReactMethod
    public void sendPayReq(ReadableMap req) {
        PayReq request = new PayReq();
        request.appId = req.getString("appId");
        request.partnerId = req.getString("partnerId");
        request.prepayId = req.getString("prepayId");
        request.packageValue = "Sign=WXPay";
        request.nonceStr = req.getString("nonceStr");
        request.timeStamp = Integer.toString(req.getInt("timeStamp"));
        request.sign = req.getString("sign");
        api.sendReq(request);
    }

    @ReactMethod
    public void sendMessageReq(ReadableMap req) {
        SendMessageToWX.Req request = null;

        WXMediaMessage.IMediaObject mediaObject = null;
        if(req.getString("webpageUrl") != null) {
            WXWebpageObject object = new WXWebpageObject();
            object.webpageUrl = req.getString("webpageUrl");
            mediaObject = object;
        }

        if(mediaObject != null) {
            request = new SendMessageToWX.Req();
            WXMediaMessage message = new WXMediaMessage(mediaObject);
            message.title = req.getString("title");
            message.description = req.getString("description");
            if(req.getString("thumbImage") != null) {
                try {
                    URLConnection conn = (new URL(req.getString("thumbImage"))).openConnection();
                    conn.connect();
                    Bitmap image = BitmapFactory.decodeStream(conn.getInputStream());
                    message.setThumbImage(image);
                }catch (IOException e) {

                }

            }

            request.message = message;
            request.scene = req.getInt("scene");
        }

        if(request != null) {
            api.sendReq(request);
        }
    }

    public void onResp(BaseResp baseResp) {

        if(baseResp instanceof PayResp) {
            PayResp payResp = (PayResp) baseResp;
            WritableMap params = Arguments.createMap();

            params.putInt("errCode", payResp.errCode);
            params.putString("errStr", payResp.errStr);
            params.putString("returnKey", payResp.returnKey);

            getReactApplicationContext()
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("wxpayreturn", params);
        }



    }
}
