// 重写Url
module.exports = function(rules){
    return async (ctx,next)=>{
        rules.forEach(rule =>{
            //如果有正则表达式
            if(rule.regex){
                let result = rule.regex.exec(ctx.url);
                if(result){
                    if(rule.dist){
                        ctx.url = rule.dist;
                    }else{
                        ctx.url = result[1];
                    }
                }
            }

            if(ctx.url === rule.src){
                ctx.url = rule.dist;
            }
        });

        await next();
    }
}