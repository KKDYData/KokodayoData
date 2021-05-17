const WebFramework = require('@midwayjs/koa').Framework
const web = new WebFramework().configure({
  port: process.env.PORT,
})

const { Bootstrap } = require('@midwayjs/bootstrap')
Bootstrap.load(web).run()
