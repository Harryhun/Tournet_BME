const app = require('express');
const server = require('http').createServer(app);

const io = require('socket.io')(server);
const fs = require('fs');

io.on('connection', (socket) => {
    console.log("Client Connected.");

    socket.on('sendData', (data) => {
        fs.appendFile('database.txt', '\n' + data, (err) => {});
        console.log("Data recieved!");
    })

    socket.on('requestData', () => {
        fs.readFile('database.txt', 'utf-8' ,(err, data) => {
            var dataArray = data.split('\n');
            socket.emit("serverDataReply",dataArray[dataArray.length-1]);
        });
        console.log("Data sent!");
    }) //utolsó sort visszadja az 'adatbázisból'

})

server.listen(3000);