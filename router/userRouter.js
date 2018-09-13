const Router = require('koa-router');
const userController = require('../controllers/userController');
let {port} = require('../config')

let router = new Router();

router.get('/user/register',(ctx,next)=>{
    ctx.render('register');
})
.get('/user/login',(ctx,next)=>{
    ctx.render('login',{
        port
    });
})
.post('/user/check-username',userController.checkUsername)
.post('/user/do-register',userController.doRegister)
.post('/user/do-login',userController.doLogin)
.get('/user/logout',userController.doLogout)
.get('/user/get-pic',userController.getCaptcha)
module.exports = router;