module.exports = function(routeList){
    function _checkLogin(ctx){
        return ctx.session.user;   //返回true代表有用户已登录
    }

    return async function(ctx,next){
       let isNext = true;
       routeList.forEach(async route=>{
           //如果是正则表达式
           if(route instanceof RegExp){
               if(route.test(ctx.url)){
                   isNext = _checkLogin(ctx);
               }
           }
           //如果是字符串
           if(route == ctx.url){
               isNext = _checkLogin(ctx);
           }
       });

       if(isNext){
           console.log('放行了');
           await next();
       }else{
            console.log('不放行');
            ctx.render('error',{
                msg:'您未登录'
            });
            return;

       }
    }
}