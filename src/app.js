import '../static/font-awesome/css/font-awesome.min.css';
import s from './app.scss';

const socket = io();

export default {
  mounted() {
    const { lines } = this;
    socket.on('message', (message) => {
      lines.push({
        type: 'left',
        message,
        img_src: 'https://beebom-redkapmedia.netdna-ssl.com/wp-content/uploads/2016/01/Reverse-Image-Search-Engines-Apps-And-Its-Uses-2016.jpg',
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
        img_src: 'https://beebom-redkapmedia.netdna-ssl.com/wp-content/uploads/2016/01/Reverse-Image-Search-Engines-Apps-And-Its-Uses-2016.jpg',
      });
    },
  },
  template: require('babel-loader!template-string-loader!./app.html')({
    ...s,
  }),
};
