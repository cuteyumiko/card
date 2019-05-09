import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';

var app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended:true,limit:'5mb'}))
app.use(bodyParser.json());
app.use(bodyParser.text({type:'text/xml'}));
app.disable('x-powered-by');
app.enable('trust proxy');

app.use('/api/v2', require('./routes/api2'));
app.use('/api', require('./routes/api'));
app.use('/webhook', require('./routes/webhook'));
app.use('/mpi', require('./routes/mpi'));

app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  console.log(err)
  res.json({headers:req.headers, url: req.url});
});

app.listen(process.env.SERVER_PORT || 9078);
