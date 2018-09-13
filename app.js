const Koa = require('koa');
const render = require('koa-art-template');
const path = require('path');
const db = require('./db');
const {rewriteUrlList,port,routeList,uploadDir,staticDir} = require('./config');



const app = new Koa();

//配置渲染模板
render(app,{
    root:path.join(__dirname,'views'),
    extname:'.html',
    debug: process.env.NODE_ENV !== 'production'
});


//app.use(require('koa-bodyparser')());

// //处理静态资源
app.use(async (ctx,next)=>{
    if(ctx.url.startsWith('/public')){
        ctx.url = ctx.url.replace('/public','');
    }
    await next();
});
// //resolve把相对路径变成绝对路径
app.use(require('koa-static')(staticDir,{
    setHeaders:function(res,path,stats){
        if(path.endsWith('.mp3')){
            let size = stats.size;
            res.setHeader('Accept-Ranges','bytes');
            res.setHeader('Content-Ranges','bytes 0-'+(size-1)+'/'+size);
        }
    }
}));


//处理session
const session = require('koa-session');
//signed为true的时候，根据这个key来做签名，保证cookie不被修改
app.keys = ['some secret hurr'];   


//将session对应的数据保存在服务器内存中
// let store = {
//     storage:{},
//     set:function(key,session){
//         this.storage[key]=session;
//     },
//     get:function(key){
//         return this.storage[key];
//     },
//     destroy:function(key){
//         delete this.storage[key];
//     }
// }

var Redis = require('ioredis');
var redis = new Redis();
let store = {
    set:function(key,session){
        redis.set(key,JSON.stringify(session));
    },
    get: async function(key){
        let obj = await redis.get(key);
        obj = JSON.parse(obj);
        //console.log("==="+obj);
        
        return obj;
    },
    destroy:function(key){
        redis.del(key);
    }
}

const CONFIG = {
    key:'koa:sess',   //cookie的名称
    maxAge:8640000,   //过期时间
    httpOnly:true,    //客户端无法访问该cookie
    signed:true,     // 数据签名，根据数据进行计算，保证数据不被修改
    rolling:false,  // 顺延的cookie的有效期
    store:store     // 内存存储session数据
}
app.use(session(CONFIG,app));
//处理session结束

//拦截需要登录验证的请求进行验证
const checkLogin = require('./middlewares/checkLogin');
app.use(checkLogin(routeList));

//上传文件
const formidable = require('koa-formidable');
app.use(formidable({
    uploadDir,
    keepExtensions:true // 保留后缀名
}))


const userRouter = require('./router/userRouter')
const musicRouter = require('./router/musicRouter');
//统一异常处理
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

//重写路径
const rewriteUrl = require('./middlewares/reWriteUrl');
app.use(rewriteUrl(rewriteUrlList));

//将服务器与视图进行连接
app.use(async function(ctx,next){
    ctx.state.user = ctx.session.user;
    await next();
});

//处理路由
app.use(userRouter.routes());
app.use(musicRouter.routes());

app.use(userRouter.allowedMethods());


app.listen(port,(err)=>{
    if(err){
        console.log('服务器启动失败');
    }
    console.log(`Server Running in ${port}`);
})