import _ from 'lodash';
import moment from 'moment';
import request from 'request-promise';
import crypto from 'crypto';
import qs from 'querystring';

const GATEWAY = 'https://cashier.sandpay.com.cn/gateway/api';

const public_key = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsWSLYLurGwHm0T2J8dz7
sSP5wQeWr/2EoA8y7rpIFoE5/9YN3vWD+B4E7xPtbLOrI2XDn2XPpdX99g/tFZ0O
OEvj5w1HzA644uvvyRaQJJVV/9qoy02IASQOfxcueOb/I6RQcIlrjo61iHSUvkri
Nj14mS8e+2nwPsjIF6xRQ+n1Hh0cQSB6QwD/bdVp2H3L4zvx9Fhk4reYYqVvR4YR
bMQcTiAWFtrPASzXVg/DQVgbqnhUytNkmIIgnwYjSeS/wibP2DriWCJkshAzkbHZ
v1ppP6kmGu8CCd7O2YLoiVhFzb9SmLsmXSqDw0a78S/hNNRUpARnDRjjdcbx825A
TQIDAQAB
-----END PUBLIC KEY-----`;

const certificate = `-----BEGIN CERTIFICATE-----
MIIEFzCCAv+gAwIBAgIFEWQVVBUwDQYJKoZIhvcNAQEFBQAwITELMAkGA1UEBhMC
Q04xEjAQBgNVBAoTCUNGQ0EgT0NBMTAeFw0xODA0MDgwNTQ0MzBaFw0yMTA0MDgw
NTQ0MzBaMIGCMQswCQYDVQQGEwJDTjEQMA4GA1UEChMHT0NBMVJTQTENMAsGA1UE
CxMEc2FuZDEZMBcGA1UECxMQT3JnYW5pemF0aW9uYWwtMTE3MDUGA1UEAwwuc2Fu
ZEDml6DplKHmnqvlj7blub/lkYrmnInpmZDlhazlj7hAMTk0MTA2OTNAMTCCASIw
DQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALFki2C7qxsB5tE9ifHc+7Ej+cEH
lq/9hKAPMu66SBaBOf/WDd71g/geBO8T7WyzqyNlw59lz6XV/fYP7RWdDjhL4+cN
R8wOuOLr78kWkCSVVf/aqMtNiAEkDn8XLnjm/yOkUHCJa46OtYh0lL5K4jY9eJkv
Hvtp8D7IyBesUUPp9R4dHEEgekMA/23Vadh9y+M78fRYZOK3mGKlb0eGEWzEHE4g
FhbazwEs11YPw0FYG6p4VMrTZJiCIJ8GI0nkv8Imz9g64lgiZLIQM5Gx2b9aaT+p
JhrvAgneztmC6IlYRc2/Upi7Jl0qg8NGu/Ev4TTUVKQEZw0Y43XG8fNuQE0CAwEA
AaOB8zCB8DAfBgNVHSMEGDAWgBTR2+mIguXdGo9MqgCMvnzyqxv22TBIBgNVHSAE
QTA/MD0GCGCBHIbvKgEBMDEwLwYIKwYBBQUHAgEWI2h0dHA6Ly93d3cuY2ZjYS5j
b20uY24vdXMvdXMtMTQuaHRtMDgGA1UdHwQxMC8wLaAroCmGJ2h0dHA6Ly9jcmwu
Y2ZjYS5jb20uY24vUlNBL2NybDE0MDM5LmNybDALBgNVHQ8EBAMCA+gwHQYDVR0O
BBYEFJQZuViz7oqAmc6jf/E886pxDuw3MB0GA1UdJQQWMBQGCCsGAQUFBwMCBggr
BgEFBQcDBDANBgkqhkiG9w0BAQUFAAOCAQEABsYd5BKjktu07m9QkSKNAV0r++Uq
yy1DICVZLDBna+lFHr0YYWPHYmJDvrFJgN07bxH1Uo+SzKY51nn8BkJteKCZkJv2
2UUmjNiOiFebSPDH+7zonK1F9b848gb/nNRHKRg7PMwMdXDULJPSuqAI2yiwk2i8
Kb3CrcyxFsSI+TOwsRkNTW3NHKmjl4gyHMY5wtkQQCk2UqsE+NLLEfx3QYk0B2Wt
4vmXf/rQOa4HWJciZzn4wfXrV6O/O+MNpsNoeh9PFcjfFFZiWSN3oSa4ze+8+6RF
H/eXPEIZD4WcfZj/p3Ar6ALdV0WUayHgGrAyppYMEnoy15Nx85MeVLSCYA==
-----END CERTIFICATE-----`;

export default {
  name: '杉德线上支付',
  config: [
    { label: '商户号', name: 'mid' },
    { label: '产品列表', name: 'productId', list: [
      { label: '微信支付', value: '00000005'},
      { label: '支付宝支付', value: '00000006'},
      { label: '网关支付', value: '00000007'},
      { label: 'H5银行卡支付', value: '00000008'},
      { label: '微信sdk支付', value: '00000024'},
      { label: '微信h5支付', value: '00000025'},
    ]},
    { label: '私钥', name: 'private_key', type: 'textarea' },
  ],

  async createPayInfo({ mid, productId, private_key }, order) {

    const {
      clientIp,
      subject, out_trade_no, total_fee, notify_url, return_url
    } = order;

    let payMode = '';
    let payExtra = {};
    switch(productId) {
      case '00000005': {
        payMode = 'sand_wxh5';
        payExtra = {
          ip: clientIp,
          sceneInfo: subject,
        };
      }; break;
      case '00000007': {
        payMode = 'bank_pc';
        payExtra = {
          payType: '1',
          bankCode: '01030000',
        };
      }; break;
      case '00000008': {
        payMode = 'sand_h5';
      }; break;

    }

    const data = {
      head: {
        version: '1.0',
        method: 'sandpay.trade.pay',
        productId,
        accessType: '1',
        mid,
        channelType: '07',
        reqTime: moment().format('YYYYMMDDHHmmss'),
      },
      body: {
        orderCode: out_trade_no,
        totalAmount: '000000000101',
        subject,
        body: subject,
        txnTimeOut: moment().add('30', 'm').format('YYYYMMDDHHmmss'),
        payMode,
        payExtra,
        clientIp,
        notifyUrl: notify_url,
        frontUrl: return_url
      }
    }
    console.log(data);

    const form = {
      charset: 'utf-8',
      signType: '01',
      data: JSON.stringify(data),
    };
    form.sign = crypto.createSign('RSA-SHA1').update(form.data).sign(private_key, 'base64');

    const respText = await request.post(`${GATEWAY}/order/pay`, { form })
    const respForm = qs.parse(decodeURIComponent(respText));

    const respFormData = respForm.data.replace(/( |\t|　|\n|\r)/g, '');
    const respFormSign = respForm.sign.replace(/ /g, '+');
    respForm.sign = respForm.sign.replace(/ /g, '+')

    if(!crypto.createVerify('RSA-SHA1').update(respFormData).verify(certificate, respFormSign, 'base64')){
      console.log('----respText----');
      console.log(respText);
      console.log('----respForm----');
      console.log(respForm);
      console.log('响应签名错误')
    }

    const respPayload = JSON.parse(respFormData);
    if(respPayload.head.respCode !== '000000'){
      throw new Error(respPayload.head.respMsg)
    }

    return {
      credential: respPayload.body.credential
    }

    console.log(JSON.parse(respFormData));

  },

  async notify({ mid, productId, private_key }, req, res) {

  },
}
