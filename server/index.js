const Koa = require('koa')
const app =new Koa()
const router = require('koa-router')();
router.get('/department',(ctx,next)=>{
  ctx.body = {
    code:"OK",
    list: [
      {
        id: 1,
        parentId: 0,
        title: '公司',
        checked: false,
        expand: true
      },
      {
        id: 4,
        parentId: 1,
        title: '开发一部',
        checked: false,
        expand: true
      },
      {
        id: 2,
        parentId: 1,
        title: '开发二部',
        checked: false,
        expand: true
      },
      {
        id: 5,
        parentId: 3,
        title: '前端组',
        checked: false,
        expand: true
      },
      {
        id: 3,
        parentId: 1,
        title: '开发三部',
        checked: false,
        expand: true
      },
      {
        id: 6,
        parentId: 3,
        title: '后端组',
        checked: false,
        expand: true
      },
      {
        id: 7,
        parentId: 4,
        title: '爆破组',
        checked: false,
        expand: true
      },
      {
        id: 8,
        parentId: 2,
        title: '测试组',
        checked: false,
        expand: true
      },
      {
        id: 9,
        parentId: 2,
        title: '运维组',
        checked: false,
        expand: true
      },
      {
        id: 10,
        parentId: 9,
        title: '西岚',
        checked: false,
        expand: true
      },
      {
        id: 11,
        parentId: 9,
        title: '东岚',
        checked: false,
        expand: true
      },
      {
        id: 12,
        parentId: 5,
        title: '南岚',
        checked: false,
        expand: true
      }
    ]
  };
})

app.use(router.routes())
app.listen('1234')