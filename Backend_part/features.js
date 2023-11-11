const { Sequelize } = require('sequelize')
const databaseConn = new Sequelize('tournet', 'admin', 'pass', {
    host: 'localhost',
    dialect: 'mysql'
})

let fs = require('fs')
const auth = require('basic-auth')

let initModels = require("./models/init-models")
const db = initModels(databaseConn)
db.rating.hasOne(db.place)
db.place.belongsTo(db.rating)
db.picture.hasOne(db.place)
db.place.belongsTo(db.picture)
db.picture.hasOne(db.domain)
db.domain.belongsTo(db.picture)
db.place.belongsToMany(db.domain, {through: db.placedomainconnector})
db.domain.belongsToMany(db.place, {through: db.placedomainconnector})
db.place.belongsToMany(db.user, {through: db.userplaceconnector})
db.user.belongsToMany(db.place, {through: db.userplaceconnector})



module.exports = function() {
    this.login = async function login(req, res)
    {
        user = auth(req)
        if(user)
        {  
            db.user.findOne({
                where: {
                    name: req.body.userName,
                    password: req.body.password
                }
            })
            .then((queryRes) => 
            {
                if(queryRes == null)
                {
                    res.json({
                        status: 0, //Üres válasz
                        userId: null
                    })
                }
                else
                {
                    res.json({
                        status: 1, //Sikeres
                        userId: queryRes.dataValues.id
                    })
                }
            })
            .catch((err) =>
            {
                res.json({
                    status: 2, //Sikertelen
                    userId: null
                })
            })
        }
        else
        {
            res.status(403).send("Access denied.")
        }
    }
    
    this.signUp = async function signUp(req, res)
    {
        user = auth(req)
        if(user)
        {           
            db.user.create({
                name: req.body.userName,
                password: req.body.password,
                email: req.body.emailAddress,
                roleId: 3
            })
            .then((queryRes) => {
                db.user.findOne({
                    where: {
                        name: req.body.userName,
                        password: req.body.password
                    }
                })
                .then((queryRes) => 
                {
                    res.json({
                        status: 1, //Sikeres
                        userId: queryRes.dataValues.id
                    })
                })
                .catch((err) =>
                {
                    res.json({
                        status: 2, //Sikertelen
                        userId: null
                    })
                })
            })
            .catch((err) => {
                res.json({
                    status: 2, //Sikertelen
                    userId: null
                })
            })
        }
        else
        {
            res.status(403).send("Access denied.")
        }
    }
    
    this.forgotPassword = async function forgotPassword(req, res)
    {
        user = auth(req)
        if(user)
        {        
            db.user.findOne({
                where: {
                    email: req.body.emailAddress,
                }
            })
            .then((queryRes) => 
            {
                if(queryRes == null)
                {
                    res.json({
                        status: 0, //Üres válasz
                        userId: null
                    })
                    return
                }
                //---ÚJ TEMP JELSZÓ LÉTREHOZÁSA---
                const crypto = require('crypto')
                const newPass = crypto.randomBytes(5).toString('hex') //Létrehoz egy random 10 számból/hexa betűből álló temp 'jelszót'
                db.user.update({password: newPass}, {
                        where: {
                        email: req.body.emailAddress
                    }}
                )
                .then((queryRes2) => {
                    //---EMAIL KÜLDÉS (Nodemailer)--- 
                    const mailer = require('nodemailer')
                    const mailSender = mailer.createTransport(
                    {
                        service: 'gmail',
                        auth: {
                            user: 'TournetBMEPassRecovery@gmail.com',
                            pass: 'afeeqdjeczemdkzs' //! NAGY A BAJ
                        }
                    })
                    const content = {
                        from: 'TournetBMEPassRecovery@gmail.com',
                        to: req.body.emailAddress,
                        subject: 'TournetBME - Jelszó helyreállítás',
                        text: 'Az új jelszavad: ' + newPass + "\n\nKérjük, hogy a fiókod biztonsága érdekében a következő bejelentkezésnél állíts új jelszót a profilbeállításoknál!"
                    }
                    mailSender.sendMail(content, (err, data) => {
                        if(err)
                        {
                            res.json({
                                status: 2, //Sikertelen
                            })
                            console.log(err)
                        }
                        else
                        {
                            res.json({
                                status: 1, //Sikeres
                            })
                        }
                    })   
                }) 
                .catch((err) =>
                {
                    res.json({
                        status: 2, //Sikertelen
                    })
                })        
            })
            .catch((err) =>
            {
                res.json({
                    status: 2, //Sikertelen
                })
            })
        }
        else
        {
            res.status(403).send("Access denied.")
        }
    }
    
    this.requestDomains = async function requestDomains(req, res)
    {
        user = auth(req)
        if(user)
        {
            db.domain.findAll({
                include: [db.picture]
            })
            .then(queryRes => {
                let domainObjectList = new Array()
                for(let i = 0; i < queryRes.length; i++)
                {
                    domainObjectList[i] = {}
                    domainObjectList[i]['name'] = queryRes[i].dataValues.name
                    domainObjectList[i]['rating'] = queryRes[i].dataValues.rating
                    domainObjectList[i]['picture'] = Buffer(fs.readFileSync('./images/domains/'+queryRes[i].dataValues.picture.source)).toString('base64')
                }
                res.json({
                    status: 1, //Sikeres
                    domains: domainObjectList 
                })
            })
            .catch((err) =>
            {
                res.json({
                    status: 2, //Sikertelen
                })
            })
        }
        else
        {
            res.status(403).send("Access denied.")
        }
    }
    
    this.requestPlaces = async function requestPlaces(req, res)
    {
        user = auth(req)
        if(user)
        {
            db.place.findAll({
                include: [db.rating, db.picture, {model: db.domain, where: {id: req.body.domainId}}],
            })
            .then(queryRes => {
                let placeObjectList = new Array()
                for(let i = 0; i < queryRes.length; i++)
                {
                    placeObjectList[i] = {}
                    placeObjectList[i]['name'] = queryRes[i].dataValues.name
                    placeObjectList[i]['rating'] = {}
                    placeObjectList[i]['rating']['oneStar'] = queryRes[i].dataValues.rating.oneStar
                    placeObjectList[i]['rating']['twoStar'] = queryRes[i].dataValues.rating.twoStar
                    placeObjectList[i]['rating']['threeStar'] = queryRes[i].dataValues.rating.threeStar
                    placeObjectList[i]['rating']['fourStar'] = queryRes[i].dataValues.rating.fourStar
                    placeObjectList[i]['rating']['fiveStar'] = queryRes[i].dataValues.rating.fiveStar
                    placeObjectList[i]['visitors'] = queryRes[i].dataValues.visitors
                    placeObjectList[i]['picture'] = Buffer(fs.readFileSync('./images/places/'+queryRes[i].dataValues.picture.source)).toString('base64')
                    placeObjectList[i]['description'] = queryRes[i].dataValues.description
                    placeObjectList[i]['website'] = queryRes[i].dataValues.website
                    placeObjectList[i]['price'] = queryRes[i].dataValues.price
                    placeObjectList[i]['latitude'] = queryRes[i].dataValues.latitude
                    placeObjectList[i]['longitude'] = queryRes[i].dataValues.longitude
                }
                res.json({
                    status: 1, //Sikeres
                    places: placeObjectList
                })
            })
            .catch((err) =>
            {
                res.json({
                    status: 2, //Sikertelen
                })
            })
        }
        else
        {
            res.status(403).send("Access denied.")
        }
    }
    
    this.recieveSuggestion = async function recieveSuggestion(req, res)
    {
        user = auth(req)
        if(user)
        {
            db.suggestion.create({
                domainId: req.body.domainId,
                userId: req.body.userId,
                suggestion: req.body.suggestionName,
            })
            .then(queryRes => {
                res.json({
                    status: 1, //Sikeres
                })
            })
            .catch((err) => {
                res.json({
                    status: 2, //Sikertelen
                })
            })
        }
        else
        {
            res.status(403).send("Access denied.")
        }
    }
    
    this.setVisited = async function setVisited(req, res)
    {
        user = auth(req)
        if(user)
        {
            db.userplaceconnector.findOne({
                where: {
                    userId: req.body.userId,
                    placeId: req.body.placeId
                }
            })
            .then(queryRes => {
                if(queryRes == null)
                {
                    db.userplaceconnector.create({
                        placeId: req.body.placeId,
                        userId: req.body.userId,
                        rating: 0
                    })
                    .then(queryRes2 => {
                        db.place.increment({visitors: +1},{
                            where: { id: req.body.placeId }
                        })
                        .then(queryRes3 => {
                            res.json({
                                status: 1, //Sikeres
                            })
                        })
                        .catch((err) =>
                        {
                            res.json({
                                status: 2, //Sikertelen
                            })
                        })
                    })
                    .catch((err) =>
                    {
                        res.json({
                            status: 2, //Sikertelen
                        })
                    })
                }
                else
                {
                    queryRes.destroy()
                    .then(queryRes2 => {
                        db.place.increment({visitors: -1},{
                            where: { id: req.body.placeId }
                        })
                        .then(queryRes3 => {
                            res.json({
                                status: 1, //Sikeres
                            })
                        })
                        .catch((err) =>
                        {
                            res.json({
                                status: 2, //Sikertelen
                            })
                        })
                    })
                    .catch((err) =>
                    {
                        res.json({
                            status: 2, //Sikertelen
                        })
                    })
                }
            })
            .catch((err) =>
            {
                res.json({
                    status: 2, //Sikertelen
                })
            })
        }
        else
        {
            res.status(403).send("Access denied.")
        }
    }
    
    this.setRating = async function setRating(req, res)
    {

        user = auth(req)
        if(user)
        {
            db.userplaceconnector.findOne({
                where: {
                    userId: req.body.userId,
                    placeId: req.body.placeId
                }
            })
            .then(queryRes => {
                if(queryRes == null)
                {
                    db.userplaceconnector.create({
                        placeId: req.body.placeId,
                        userId: req.body.userId,
                        rating: req.body.ratingValue
                    })
                    .then(queryRes2 => {
                        res.json({
                            status: 1, //Sikeres
                        })
                    })
                    .catch((err) =>
                    {
                        res.json({
                            status: 2, //Sikertelen
                        })
                    })
                }
                else
                {
                    db.userplaceconnector.update({rating: req.body.ratingValue}, {
                            where: {
                                placeId: req.body.placeId,
                                userId: req.body.userId,
                            }
                    })
                    .then(queryRes2 => {
                        res.json({
                            status: 1, //Sikeres
                        })
                    })
                    .catch((err) =>
                    {
                        res.json({
                            status: 2, //Sikertelen
                        })
                    })
                }
            })
            .catch((err) =>
            {
                res.json({
                    status: 2, //Sikertelen
                })
            })
        }
        else
        {
            res.status(403).send("Access denied.")
        }
    }
    
    this.profileUpdate = async function profileUpdate(req, res)
    {
        user = auth(req)
        if(user)
        {   
            //---ADATBÁZIS UPDATE (Sequelize?)---
            switch(req.body.type)
            {
                default: break;
                case 0:

                db.user.update({name: req.body.newInfo}, {
                    where: {
                        id: req.body.userId,
                    }
                })
                .then(queryRes => {
                    res.json({
                        status: 1, //Sikeres
                })
                })
                .catch((err) =>
                {
                    res.json({
                        status: 2, //Sikertelen
                    })
                })

                break;
                case 1:

                db.user.update({password: req.body.newInfo}, {
                    where: {
                        id: req.body.userId,
                    }
                })
                .then(queryRes => {
                    res.json({
                        status: 1, //Sikeres
                })
                })
                .catch((err) =>
                {
                    res.json({
                        status: 2, //Sikertelen
                    })
                })

                break;
                case 2:

                db.user.update({email: req.body.newInfo}, {
                    where: {
                        id: req.body.userId,
                    }
                })
                .then(queryRes => {
                    res.json({
                        status: 1, //Sikeres
                    })
                })
                .catch((err) =>
                {
                    console.log(err)
                    res.json({
                        status: 2, //Sikertelen
                    })
                })

                break;
            }
        }
        else
        {
            res.status(403).send("Access denied.")
        }
    }    
}