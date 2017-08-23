const Koa	= require('koa');
const logger = require('koa-logger')();
const router = require('koa-router')();
const path =require('path');
const serve = require('koa-static');


const app = new Koa();

app.use(logger);
app.use(router.routes());
app.use(serve(path.resolve('../dist/')));

const http = require('http').Server(app.callback());
const io = require('socket.io')(http);


io.on('connection', (socket) => {
	console.log(socket);
  socket.on('message', (msg) => {
  	socket.emit('message', 'i heard you!');
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

http.listen(8080, () => {
	console.log(`listening on port: ${ 8080 }`);
});
