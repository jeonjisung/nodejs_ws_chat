const express = require('express'); 
const app = express(); 

app.use("/", (req, res)=>{ 
    res.sendFile('index.html', { root: __dirname }) 
}); // index.html 파일 응답

const wsModule = require('ws'); 

const HTTPServer = app.listen(8100, ()=>{ 
    console.log("Server is open at port:8100"); 
});

const wss = new wsModule.Server( 
    { 
        server: HTTPServer, 
    } 
);

// 브로드캐스트
wss.on("connection", (ws, request) =>{
    ws.on("message", data => {
        wss.clients.forEach(client => {
            client.send(data.toString())
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

