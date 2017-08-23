import s from './app.scss';

const socket = io();

export default {
  mounted() {
    document.querySelector('.inputWrapper > input').focus();
    const { lines } = this;
    socket.on('message', (message) => {
      lines.push({
        type: 'left',
        message,
        img_src: '/image/robot.jpg',
      });
    });
  },
  updated() {
    this.scroll2Bottom();
  },
  data() {
    return {
      lines: [],
    };
  },
  methods: {
    scroll2Bottom() {
      window.scrollTo(0, document.body.scrollHeight);
    },
    sendMessage() {
      const message = document.querySelector('input').value;
      if (message === '') return;
      document.querySelector('input').value = '';
      socket.emit('message', message);
      this.lines.push({
        type: 'right',
        message,
      });
    },
  },
  template: require('babel-loader!template-string-loader!./app.html')({
    ...s,
  }),
};
