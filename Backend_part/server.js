const express = require('express')
const app = express()
const Features = require('./features.js')
const f = new Features()

app.use(express.json())

console.log("Server started!")

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

app.listen(3000)