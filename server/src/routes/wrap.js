import objectService from '../object';

export default fn => (req, res, next) => fn(req, res, next).catch(async e => {
  const { user = {} } = req;
  const message = e.message;
  await objectService.postObject('system_log', {
    name: `请求 [ ${req.originalUrl} ] 出错 [ ${message} ]`, level_id: 3,
    create_ip: req.ip, creator_id: user.id,
    content: e.stack
  });
  res.status(500).send(message)
});
