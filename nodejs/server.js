const express = require('express');
const app = express();

const wsModule = require('ws');

const mysql = require('mysql');
const conn = {
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: '1234',
    database: 'CHAT_LOG'
};

app.use("/", (req, res) => {
    res.sendFile('index.html', { root: __dirname })
}); // index.html 파일 응답


const HTTPServer = app.listen(8100, () => {
    console.log("Server is open at port:8100");
});

const wss = new wsModule.Server(
    {
        server: HTTPServer,
    }
);

// 브로드캐스트
wss.on("connection", (ws, request) => {

    let connection = mysql.createConnection(conn);
    connection.connect();

    ws.on("message", data => {

        wss.clients.forEach(client => {
            client.send(data.toString())
            let sql = `INSERT INTO chat(MESSAGE, DATE) VALUES ('${data.toString()}', NOW());`

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