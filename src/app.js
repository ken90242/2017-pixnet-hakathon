import s from './app.scss';
import genId from './utils/generateId'
import '../static/font-awesome/css/font-awesome.min.css';
import mandam from '../static/image/mandam.png';

const socket = io();
window.scrollTo(0, 1);
export default {
  mounted() {
    document.querySelector('.inputWrapper > input').focus();
    const { readStatusTable, lines } = this;
    socket.on('message', ({ id, message }) => {
      this.$set(this.readStatusTable, id, 2);
      if(id) {
        const NextTimePos = this.$refs[id][0].offsetTop + this.$refs[id][0].offsetHeight - 20;
        this.$refs.ifRead.style.top = NextTimePos;
        this.lastReadAvaPosition = this.$refs[id][0].offsetTop;
      }
      lines.push({
        type: 'left',
        message,
        img_src: this.imgs.mandam,
      });
      if ((window.outerHeight + window.scrollY) < document.body.scrollHeight) {
        this.scrolledBottom = false;
      } else {
        this.scroll2Bottom();
      }
    });
    socket.on('received', (id) => {
      this.$set(readStatusTable, id, 1);
      this.$forceUpdate();
    });
    let lastScrollTop = 0;
    window.addEventListener('scroll', (e) => {
      var st = window.pageYOffset || window.scrollTop;
       if (st > lastScrollTop){
           this.scrolledBottom = true;
       } else {
          // upscroll code
       }
       lastScrollTop = st;
    });
  },
  updated() {
    if ((window.outerHeight + window.scrollY) >= document.body.scrollHeight) {

    }
  },
  data() {
    return {
      imgs: {
        mandam,
      },
      lines: [],
      readStatusTable: {},
      lastReadAvaPosition: 0,
      scrolledBottom: true,
    };
  },
  methods: {
    scroll2Bottom() {
      this.$nextTick(() => {
        window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
      })
    },
    sendMessage() {
      const message = document.querySelector('input').value;
      const id = genId();
      if (message === '') return;
      document.querySelector('input').value = '';
      socket.emit('message', { id, message });
      this.readStatusTable[id] = 0;
      this.lines.push({
        id,
        type: 'right',
        message,
      });
      if ((window.outerHeight + window.scrollY) >= document.body.scrollHeight) {
        this.scroll2Bottom();
      }
    },
  },
  template: require('babel-loader!template-string-loader!./app.html')({
    ...s,
  }),
};
