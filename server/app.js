const Koa = require('koa');
const logger = require('koa-logger')();
const axios = require('axios');
const path =require('path');
const serve = require('koa-static');
const slogger = require('slogged');


const app = new Koa();

app.use(serve('./dist'));

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
      },100)
    });
    setTimeout(function() {
      socket.emit('received', id);
    }, 400);
  });
});

http.listen(8080, () => {
	console.log(`🌎  Server is listening on: ${ 8080 }`)
});
