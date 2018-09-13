const musicDB = require('../db');

module.exports = {
    findMusicByUid:id => musicDB.q('select * from musics where uid = ?',[id]),
    addMusicByFields:(...fields)=> musicDB.q('insert into musics (title,singer,time,file,filelrc,uid) values (?,?,?,?,?,?)',fields),
    findMusicById:id => musicDB.q('select * from musics where id =?',[id]),
    updateMusic:(...music)=>music.q('update musics set title = ? ,singer = ?, time = ?, file = ?,filelrc = ? where id = ?',music),
    deleteMusicById:id=>music.q('delete form musics where id =?',[id])

}