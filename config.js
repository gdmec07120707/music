const path = require('path');
module.exports = {
    rewriteUrlList:[
        { regex:/^\/public\/(.*)/  },// 为了解决前端的/public 多余
        { src:'/',dist:'/user/login'}
    ],
    port:8080,
    dbconfig:{
        connectionLimit: 10,
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'node_music'
    },
    routeList:[
        /^\/music\/.*$/,
        '/user/logout'
    ],
    uploadDir:path.resolve('./public/files')
}