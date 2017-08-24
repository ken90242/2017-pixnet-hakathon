const Koa = require('koa');
const logger = require('koa-logger')();
const router = require('koa-router')();
const axios = require('axios');
const path =require('path');
const serve = require('koa-static');
const webpack = require('webpack');
const slogger = require('slogged');
const webpackConfig = require('./webpack.config.js');

const compiler = webpack(webpackConfig);

const devMiddleware = require('koa-webpack-dev-middleware')(compiler, {
  publicPath: '/',
  stats: {
    colors: true,
    chunks: false
  }
});

const app = new Koa();

// app.use(logger);

app.use(serve('./static'));

// serve webpack bundle output
app.use(devMiddleware);

const http = require('http').Server(app.callback());
const io = require('socket.io')(http);
io.use(slogger())

io.on('connection', (socket) => {
  socket.emit('message', { id: null, message: 'I can only say yes or no' });
  socket.on('message', ({ id, message }) => {
    axios({
      method: 'get',
      url: 'https://yesno.wtf/api',
      responseType: 'json',
    }).then((res) => {
      const message = res.data.answer;
      setTimeout(function() {
        socket.emit('message', { id, message });
      },1500)
    });
    setTimeout(function() {
      socket.emit('received', id);
    }, 400);
  });
});

http.listen(8080, () => {
  console.log(`listening on port: ${ 8080 }`);
});
