const Koa = require('koa');
const logger = require('koa-logger')();
const router = require('koa-router')();
const axios = require('axios');
const path =require('path');
const serve = require('koa-static');
const webpack = require('webpack')
const webpackConfig = require('./webpack.config.js')

const compiler = webpack(webpackConfig)

const devMiddleware = require('koa-webpack-dev-middleware')(compiler, {
  publicPath: '/',
  stats: {
    colors: true,
    chunks: false
  }
})

const app = new Koa();

// app.use(logger);

// serve webpack bundle output
app.use(devMiddleware)

const http = require('http').Server(app.callback());
const io = require('socket.io')(http);

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.emit('message', '哈囉！問我一些是非題吧！');
  socket.on('message', (msg) => {
    axios({
      method:'get',
      url:'https://yesno.wtf/api',
      responseType:'json'
    }).then((res) => {
      const message = res.data.answer;
      socket.emit('message', message);
    });
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

http.listen(8080, () => {
  console.log(`listening on port: ${ 8080 }`);
});
