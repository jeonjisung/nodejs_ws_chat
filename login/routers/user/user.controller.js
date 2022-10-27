const { User } = require('../../models');
// const { findAll } = require('../../models/user');

const mysql = require('mysql');

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '1234',
    database: 'CHAT_LOG'
});

connection.connect();

let join = (req, res) => {
    res.render('./user/join.html');
}

let join_success = async (req, res) => {
    let userid = req.body.userid
    let userpw = req.body.userpw;
    let username = req.body.username;
    let userrrn = req.body.userrrn;
    let gender = req.body.gender;

    await User.create({
        userid, userpw, username, userrrn, gender
    })

    res.render('./user/join_success.html', {
        userid, userpw, username, userrrn, gender
    });
}

let login = (req, res) => {
    let flag = req.query.flag;
    res.render('./user/login.html', { flag });
}

let login_check = async (req, res) => {
    let userid = req.body.userid;
    let userpw = req.body.userpw;

    let result = await User.findOne({
        where: { userid, userpw }
    })
    console.log(result);

    if (result == null) {
        res.redirect('/user/login?flag=0')
    } else {

        req.session.uid = userid;
        req.session.isLogin = true;

        req.session.save(() => {
            res.redirect('/');
        })
    }
}

let logout = (req, res) => {
    delete req.session.isLogin;
    delete req.session.uid;

    req.session.save(() => {
        res.redirect('/');
    })
}

let user_info = async (req, res) => {
    let userid = req.query.userid;
    let result = await User.findAll({
        wher: { userid, }
    });

    console.log(result);
    res.render('./user/info.html', { result })
    console.log(result);
}

const process = {
    users_result: (req, res) => {
        var u_Data = {};

        var query = "SELECT DATE_FORMAT(userdt, '%Y%m%d') AS userdt, count(*) AS cnt FROM users GROUP BY DATE_FORMAT(userdt, '%Y%m%d')ORDER BY userdt DESC;";
        connection.query(query, (err, rows) => {

            u_Data.user = [];
            u_Data.date = [];

            if (err) throw err;
            if (rows[0]) {
                u_Data.result = "ok";
                rows.forEach(function (val) {
                    u_Data.user.push(val.cnt);
                    u_Data.date.push(val.userdt);
                });
            } else {
                u_Data.result = "none";
                u_Data.user = "";
                u_Data.date = "";
            }
            return res.json(u_Data);
        });
    },
}

const process2 = {
    chat_result: (req, res) => {
        var c_Data = {};

        var query = "SELECT DATE_FORMAT(date, '%Y%m%d') AS date, count(*) AS cnt FROM chat GROUP BY DATE_FORMAT(date, '%Y%m%d')ORDER BY date DESC;";
        connection.query(query, (err, rows) => {

            c_Data.chat = [];
            c_Data.date = [];

            if (err) throw err;
            if (rows[0]) {
                c_Data.result = "ok";
                rows.forEach(function (val) {
                    c_Data.chat.push(val.cnt);
                    c_Data.date.push(val.date);
                });
            } else {
                c_Data.result = "none";
                c_Data.chat = "";
                c_Data.date = "";
            }
            return res.json(c_Data);
        });
    }
}

const process3 = {
    user_chat: (req, res) => {
        var uc_Data = {};

        var query = "SELECT * FROM chat;";
        connection.query(query, (err, rows) => {

            uc_Data.date = [];
            uc_Data.user = [];
            uc_Data.message = [];

            if (err) throw err;
            if (rows[0]) {
                uc_Data.result = "ok";
                rows.forEach(function (val) {
                    uc_Data.date.push({'DATE' : val.DATE });
                    uc_Data.user.push({'USER' : val.USERID });
                    uc_Data.message.push({'MESSAGE' : val.MESSAGE });
                    console.log(val.USER);
                });
            } else {
                uc_Data.result = "none";
                uc_Data.date = "";
                uc_Data.user = "";
                uc_Data.message = "";
            }
            return res.json(uc_Data);
        });
    }
}




let userid_check = async (req, res) => {

    let userid = req.query.userid;
    let flag = false; //default값 false

    let result = await User.findOne({  //비동기 처리 //query문 결과 받을 때까지 기다렸다가 result 변수에 넣음 
        where: { userid }
    })
    //result - undefined = 값이 없으니 userid 생성 가능 / 
    //result 값이 있으면 생성 불가능  

    if (result == undefined) {
        flag = true;
    } else {               // deflaut 값이 false라서 사실 else쪽은 필요없음.
        flag = false;
    }
    res.json({
        login: flag,  //flag BOOLEAN값을 넣어 주기 
        userid,
    })
}

module.exports = {
    join, join_success, login, login_check, logout, user_info, userid_check, process, process2, process3
}