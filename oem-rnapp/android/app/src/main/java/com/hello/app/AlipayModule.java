package com.hello.app;


import com.alipay.sdk.app.PayTask;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Callback;
import java.util.Map;



public class AlipayModule extends ReactContextBaseJavaModule {

    public AlipayModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "AlipayModule";
    }

    @ReactMethod
    public void payOrder(final String orderString, Callback callback) {

        PayTask alipay = new PayTask(getCurrentActivity());
        Map<String, String> result = alipay.payV2(orderString,true);

        WritableMap params = Arguments.createMap();
        params.putString("resultStatus", result.get("resultStatus"));
        params.putString("memo", result.get("memo"));
        params.putString("result", result.get("result"));

        callback.invoke(params);
    }
}
