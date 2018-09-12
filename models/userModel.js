const userDB = require('../db');
// userModel.findUser = async username => {
//     return await userDB.q('select * from users where username = ?',[username]);
// }

module.exports = {
    findUserByUsername : username => {
        return userDB.q('select * from users where username = ?',[username]);
        //console.log('==='+username);
    },
    addUser:userProps => userDB.q('insert into users (username,password,email) value(?,?,?)',userProps)
};