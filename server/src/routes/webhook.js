import _ from 'lodash';
import moment from 'moment';

import CONFIG from '../config';
const router = require('express').Router();
const knex = require('knex')(CONFIG.db);

import paymentPass from '../payment';
import productTicketProcessPass from '../product_ticket_process';
import agentpayPass from '../agentpay';

import orderService from '../service/order';
import objectService from '../object';
const objectConfig = objectService.objectConfig;

const wrap = fn => (req, res, next) => fn(req, res, next).catch(e => console.log(e.message) && res.status(500).send(e.message));


router.use(async (req, res, next) => {
  const { host } = req.headers;
  const { protocol } = req;
  console.log(host, protocol);
  req.merchant = await knex('bank_merchant').where({host}).first();
  next();
});

router.get('/info', (req, res, next) => {
  console.log(req.merchant);
  res.json({ title: 'info' });
});

router.all('/pay/:object/:payment_id', wrap(async (req, res, next) => {
  const { object, payment_id } = req.params;
  const oc = objectConfig[object];
  if(!oc) return next();

  const payment = await knex('bank_payment').where({id: payment_id}).first();
  if(!payment) throw new Error('无效的支付方式');
  const pass = paymentPass[payment.pass_code];
  if(!pass) throw new Error('错误的支付方式');

  const code = await pass.notify(JSON.parse(payment.pass_config), req, res);

  if(code) {
    await knex(oc.model).where({code, status: 1}).update({status: 2, payment_id, payment_time: moment().toDate()})
  }
}));

router.all('/payment/:id', async (req, res, next) => {
  const { id } = req.params;

  const payment = await knex('bank_payment').where({id}).first();
  if(!payment) return res.sendStatus(404);

  const pass = paymentPass[payment.pass_code];
  if(!pass) return res.sendStatus(404);

  const order_code = await pass.notify(JSON.parse(payment.pass_config), req, res)

  if(!order_code) return;

  if(order_code.charAt(0) == 'L'){
    const order = await knex('bank_user_level_order').where({code: order_code, status: 1}).first();
    if(!order) return;

    await knex('bank_user_level_order').where({id: order.id}).update({payment_id: id});

    try{
      console.log('修改升级订单状态');
      orderService.changeLevelOrderStatus(order.id, 2);
    } catch(e) {
      console.log(`payment[${id}]:${order_code}:${e.message}`)
    }
  }
});

const upload = require('multer')({dest: 'runtime/upload' });

router.all('/product_ticket_process/:id', upload.any(), async (req, res, next) => {
  const { id } = req.params;
  const { merchant } = req;

  const process = await knex('bank_product_ticket_process').where({id}).first();
  if(!process) return res.sendStatus(404);

  const pass = productTicketProcessPass[process.pass_code];
  if(!pass) return res.sendStatus(404);

  const merchant_id = merchant ? merchant.id : null;
  try {
    const [ order_code, status, comments, content ] = await pass.notify(JSON.parse(process.pass_config), req, res)
    const order = await knex('bank_product_ticket_order').where({code: order_code}).first();
    if(order) {
      await orderService.changeTicketOrderStatus(order.id, status);
      await knex('bank_product_ticket_order').where({id: order.id}).update({comments});
    }
  }catch(e) {
    await knex('bank_logs').insert({
      merchant_id,
      name: '积分券处理响应异常',
      content: e.message
    })
    res.sendStatus(200);
  }
});

router.all('/agentpay/:id', async (req, res, next) => {

  console.log('代付通知111');
  const { id } = req.params;

  const agentpay = await objectService.getObject('agentpay', { id });

  if(agentpay) {
    const pass = agentpayPass[agentpay.pass_code];
    const code = await pass.notify(JSON.parse(agentpay.pass_config), req, res)

    if(!code) return;
    const order = await objectService.getObject('cash_order', { code });
    if(order){
      await orderService.changeCashOrderStatus(order.id, 2);
      await objectService.patchObject('cash_order', { id: order.id }, {comments: '代付打款成功'});
    }
  }

  console.log('代付通知');
  console.log(req.method);
  console.log(req.body);
})



module.exports = router;
