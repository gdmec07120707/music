const musicModel = require('../models/musicModel');
const path = require('path');
module.exports = {
    //首页
    showIndex:async (ctx,next)=>{
        console.log('首页');
        let {id} = ctx.session.user;

        let musics = await musicModel.findMusicByUid(id);

        ctx.render('index',{musics});
    },
    //添加音乐
    addMusic:async (ctx,next)=>{
        console.log(ctx)
        let {title,singer,time} = ctx.request.body;
        //获取删除的文件
        let {file,filelrc} = ctx.request.files;

        let filePath,lrcPath;
        //音乐文件名
        if(file){
            filePath = path.parse(file.path).base;   //获取文件名
             // 拼接 /public/files/ +
            filePath = '/public/files/'+filePath;
        }
        //歌词文件名
        if(filelrc){
            lrcPath = path.parse(filelrc.path).base;   //获取文件名
             // 拼接 /public/files/ +
             lrcPath = '/public/files/'+lrcPath;
        }

        let uid = ctx.session.user.id;

        musicModel.addMusicByFields(title,singer,time,filePath,lrcPath,uid);

        ctx.body = {code:'ok'};
    },
    //显示编辑页面
    showEdit:async (ctx,next)=>{
        let {id} = ctx.query;
        let musics = musicModel.findMusicById(id);

        if(musics.length===0){
            ctx.throw('音乐数据不存在');
            return;
        }

        await ctx.render('edit',{
            music:musics[0]
        })
    },
    //修改音乐数据
    doUpdateMusic:async(ctx,next)=>{
        let {id,title,singer,time} = ctx.request.body;
        let {file,filelrc} = ctx.request.files;

        if(!file||!filelrc){
            ctx.throw('没有上传的文件');
            return;
        }

        let filePath = path.parse(file.path).base;   //获取文件名
             // 拼接 /public/files/ +
        filePath = '/public/files/'+filePath;

        let lrcPath = path.parse(filelrc.path).base;   //获取文件名
             // 拼接 /public/files/ +
        lrcPath = '/public/files/'+lrcPath;

        let result = await musicModel.updateMusic(title,singer,time,filePath,lrcPath,id);

        if(result.affectedRows ===1){
            ctx.body = {code:'001',msg:'更新成功'}
        }else{
            ctx.throw(result.message);
        }
    },
    //删除音乐
    doDeleteMusic:async(ctx,next)=>{
        let {id} = ctx.query;

        let result = musicModel.deleteMusicById(id);

        if(result.affectedRows ===1){
            ctx.body= {code:'001',msg:'删除成功'}
        }else{
            ctx.throw('删除失败');
        }
    }
}