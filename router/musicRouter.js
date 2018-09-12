const Router = require('koa-router');
const musicController = require('../controllers/musicController');

let router = new Router();

router.get('/music/index',musicController.showIndex)
.post('/music/add-music',musicController.addMusic)
.get('/music/add-music',(ctx,next)=>{
    ctx.render('add');
})
.get('/music/edit-music',(ctx,next)=>{
    ctx.render('edit');
})
.put('/music/update',musicController.doUpdateMusic)


module.exports = router;