const express = require('express');
const app = express();

const auth = require('basic-auth');
const fs = require('fs');

console.log("Server started!")

app.use(express.text());

app.post('/sendData', (req, res) => {
    user = auth(req);
    if(user)
    {
        fs.appendFile('database.txt', '\n' + req.body, (err) => {});
        console.log("Data recieved!");
        res.send("OK.");
    }
    else
    {
        res.status(403).send('Access denied.');
    }
})

app.get('/requestData', (req, res) => {
    user = auth(req);
    if(user)
    {
        fs.readFile('database.txt', 'utf-8' ,(err, data) => {
            var dataArray = data.split('\n');
            res.send(dataArray[dataArray.length-1]);
        });
        console.log("Data sent!");
    }
    else
    {
        res.status(403).send('Access denied.');
    }
}) //utolsó sort visszadja az 'adatbázisból'

app.listen(3000);