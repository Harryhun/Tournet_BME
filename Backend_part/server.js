const express = require('express')
const app = express()
const Features = require('./features.js')
const f = new Features()

app.use(express.json({limit: '50mb'}))

console.log("Server started!")

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    //res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'content-type,authorization');

    res.setHeader('Access-Control-Allow-Credentials', true)

    // Pass to next layer of middleware
    next();
});

app.post('/login', (req, res) => {
    f.login(req, res)
})

app.post('/signUp', (req, res) => {
    f.signUp(req, res)
})

app.post('/forgotPassword', (req, res) => {
    f.forgotPassword(req, res)
})

app.post('/requestDomains', (req, res) => {
    f.requestDomains(req, res)
})

app.post('/requestPlaces', (req, res) => {
    f.requestPlaces(req, res)
})

app.post('/recieveSuggestion', (req, res) => {
    f.recieveSuggestion(req, res)
})

app.post('/setVisited', (req, res) => { 
    f.setVisited(req, res)
})

app.post('/setRating', (req, res) => {
    f.setRating(req, res)
})

app.post('/profileUpdate', (req, res) => {
    f.profileUpdate(req, res)
})

app.post('/requestUserData', (req, res) => {
    f.requestUserData(req, res)
})

app.post('/requestUserRating', (req, res) => {
    f.requestUserRating(req, res)
})

app.post('/requestRecommendedDomain', (req, res) => {
    f.requestRecommendedDomain(req, res)
})

app.post('/addPlace', (req, res) => {
    f.addPlace(req, res)
})

app.post('/editPlace', (req, res) => {
    f.editPlace(req, res)
})

app.post('/deletePlace', (req, res) => {
    f.deletePlace(req, res)
})

app.post('/requestSuggestions', (req, res) => {
    f.requestSuggestions(req, res)
})

app.post('/deleteSuggestion', (req, res) => {
    f.deleteSuggestions(req, res)
})

app.post('/requestUsers', (req, res) => {
    f.requestUsers(req, res)
})

app.post('/setUserRole', (req, res) => {
    f.setUserRole(req, res)
})

app.listen(3000)