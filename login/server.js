const express = require('express');
const app = express();
const { sequelize } = require('./models')

const nunjucks = require('nunjucks');
const bodyParser = require('body-parser')
const routers = require('./routers')
const session = require('express-session')

const wsModule = require('ws');
const mysql = require('mysql');

app.use('/', routers);

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '1234',
    database: 'CHAT_LOG'
});

const HTTPServer = app.listen(3000, () => {
    console.log('server start port : 3000')
});

const wss = new wsModule.Server({server: HTTPServer});

app.use(session({
    secret: 'aaa',
    resave: false,
    saveUninitialized: true,
}))

app.use(bodyParser.urlencoded({ extended: false }));

nunjucks.configure('views', {
    express: app,
})

app.set('view engine', 'ejs')

sequelize.sync({ force: false })
    .then(() => {
        console.log('접속 성공')
    }).catch(() => {
        console.log('접속 실패')
    })

app.get('/', (req, res) => {
    client.query("SELECT * FROM users;", function (err, result, fields) {
        if (err) throw err;
        else {
            res.render('index', {
                data: result,
            });
        }
    });
});

app.get('/getdata', (req, res) => {

    client.query("SELECT * FROM users;", function (err, result, fields) {
        if (err) throw err;
        else {
            res.send(page);
        }
    });
});

//MySQL 연결
connection.connect();
//WS(Web Socket) 연결
wss.on("connection", (ws, request) => {

    ws.on("message", data => {
        wss.clients.forEach(client => {

            var recv_data_obj = JSON.parse(data);
            client.send("[" + recv_data_obj.username + "]" + " " + recv_data_obj.message)

            let sql = `INSERT INTO chat(DATE, USERID, MESSAGE) VALUES (NOW(), '${recv_data_obj.username}','${recv_data_obj.message}');`
            
            connection.query(sql, function (err, results) {
                if (err) {
                    console.log(err);
                }
                console.log(results);
            });
        })
    })

    wss.clients.forEach(client => {
        client.send(`새로운 유저가 접속했습니다. 현재 유저 ${wss.clients.size} 명`);

        connection.query(`select * from chat;`, function(err, result){
            if(err){
                console.log(err);
                result.render("error", {
                    message : 'board connection Error'
                });
            } else {
                var recv_result_obj = JSON.parse(JSON.stringify(result));
                client.send(recv_result_obj)
            }
        })
    })

    console.log(`새로운 유저 접속: ${request.socket.remoteAddress}`)

    ws.on("close", () => {
        wss.clients.forEach((client) => {
            client.send(`유저 한명이 떠났습니다. 현재 유저 ${wss.clients.size} 명`);
        });
    });
});