const express = require('express');
const app = express();
const {sequelize}=require('./models')

const nunjucks = require('nunjucks');
const bodyParser = require('body-parser')
const routers = require('./routers')
const session = require('express-session')

const wsModule = require('ws');
const mysql = require('mysql');

const conn = {
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: '1234',
    database: 'CHAT_LOG'
}

app.use(session({
    secret:'aaa',
    resave:false,
    saveUninitialized:true,
}))

app.use(bodyParser.urlencoded({extended:false}));
nunjucks.configure('views',{
    express:app,
})
app.set('view engine', 'html')

sequelize.sync({force:false})
.then(()=>{
    console.log('접속 성공')
}).catch(()=>{
    console.log('접속 실패')
})

app.use('/',routers);

const HTTPServer = app.listen(3000,()=>{
    console.log('server start port : 3000')
});

const wss = new wsModule.Server(
    {
        server: HTTPServer,
    }
);

wss.on("connection", (ws, request) => {

    let connection = mysql.createConnection(conn);
    connection.connect();

    ws.on("message", data => {

        wss.clients.forEach(client => {
            client.send(data.toString())
            let sql = `INSERT INTO chat(DATE, USERID, MESSAGE) VALUES (NOW(), '${req.body.userid}','${data.toString()}');`

            connection.query(sql, function (err, results, fields) {
                if (err) {
                    console.log(err);
                }
                console.log(results);
            });
            sql = "SELECT * FROM chat";

            connection.query(sql, function (err, results, fields) {
                if (err) {
                    console.log(err);
                }
                console.log(results);
            });
        })
    })

    wss.clients.forEach(client => {
        client.send(`새로운 유저가 접속했습니다. 현재 유저 ${wss.clients.size} 명`)
    })

    console.log(`새로운 유저 접속: ${request.socket.remoteAddress}`)

    ws.on("close", () => {
        wss.clients.forEach((client) => {
            client.send(`유저 한명이 떠났습니다. 현재 유저 ${wss.clients.size} 명`);
        });
    });
});
