/*
 * @Author: fangdingjie
 * @Date: 2018-09-08 14:40:36
 * @LastEditors: OBKoro1
 * @LastEditTime: 2018-09-08 14:50:10
 * @Description: 
 */
const obj ={};

const userModel = require('../models/userModel');
const captchapng = require('captchapng2');

/**
 * 检查用户是否存在
 * @param {*} ctx 
 * @param {*} next 
 */
obj.checkUsername = async (ctx,next)=>{

    console.log(ctx.request.body);
    let {username} = ctx.request.body;

    console.log(username);

    let users = await userModel.findUserByUsername(username);

    console.log('==='+users);

    if(users.length === 0){
        ctx.body ={ code:'001',msg:'可以注册'};
        return;
    }

    ctx.body = { code:'002',msg:'用户名已经存在'};

}
/**
 * 注册
 * @param {上下文对象} ctx 
 */
obj.doRegister = async ctx=>{
    let { username,password,email,v_code } = ctx.request.body;

    //判断验证码是否正确
    if(ctx.session.v_code != v_code){
        ctx.body = {code:'003',msg:'验证码错误'}
        return;
    }

    let users = await userModel.findUserByUsername(username);

    if(users.length!==0){
        ctx.body = { code: '002', msg:'用户名已经存在'};  
        return;  
    }

    let result = await userModel.addUser([username,password,email]);

    console.log("result=="+result)

    if(result.affectedRows!==1){
        ctx.throw(result.message);
        return;
    }
    ctx.body = {code:'001',msg:'注册成功'}

}

/**
 * 登录
 * @param {上下文对象} ctx 
 */
obj.doLogin = async ctx =>{
    console.log('kaishidenglu');
    let {username,password} = ctx.request.body;
    console.log(username,password);
    let users = await userModel.findUserByUsername(username);
    //验证用户名
    if(users.length === 0){
        ctx.body = {code:'002',msg:'用户名或密码不正确'};
        return;
    }
    //验证密码
    let user = users[0];
    if(user.password != password){
        ctx.body = {code:'002',msg:'用户名或密码不正确'};
        return;
    }

    //session通过cookie钥匙来实现
    ctx.session.user = user;
    ctx.body = { code:'001',msg:'登录成功'};

}

/**
 * 退出登录
 * @param {*} ctx 
 * @param {*} next 
 */
obj.doLogout = (ctx,next)=>{
    //清除当前用户对于的session
    ctx.session = null;
    ctx.redirect('/user/login');
}

/**
 * 生成随机验证码
 * @param {*} ctx 
 * @param {*} next 
 */
obj.getCaptcha = (ctx,next) =>{
    let rand = parseInt(Math.random()*9000+1000);
    let png = new captchapng(80,30,rand);

    ctx.session.v_code = rand;

    ctx.body = png.getBuffer();
}

module.exports = obj;