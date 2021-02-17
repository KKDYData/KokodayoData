const WebFramework = require('@midwayjs/web').Framework;
const web = new WebFramework().configure({
  port: 7001,
  cors: {
    origin: "http://127.0.0.1:5500",
    methods: ['GET', 'PUT', 'POST'],
    // credentials: true,
  },
});

const { Bootstrap } = require('@midwayjs/bootstrap');
Bootstrap.load(web).run();
