module.exports = async function(ctx,next) {

    try {
        await next();
    } catch (error) {
        console.log(error);
        ctx.body = `
        <div>
        对不起您访问的数据出现了异常，程序猿马上飞来拯救世界
        </div>
        `
    }

   
}