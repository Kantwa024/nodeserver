// first download all liabrary , run commends given below
// 1. npm install express
// 2. npm install mongoose
// 3. npm install body-parser
// 4. npm install dotenv
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require('body-parser');

require('dotenv').config();

var app = express();
var port = process.env.PORT||3000;
var Url = process.env.URL;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Hello World");
   });

mongoose.connect(Url,{useNewUrlParser:true ,useUnifiedTopology: true},(err)=>{
    if(err){
        console.log(err);
        return err;
    }
    console.log("mongodb connected!");
});


var Member_Schema = new mongoose.Schema({
    full_name: {type:String, required:true, unique: true},
    username: {type:String, required:true, unique: true},
    password: {type:String, required:true},
    tasks: [{taskName: {type:String, unique: true}, cStat: Boolean}],
    teams: [{teamName: {type:String, unique: true}}],
    admin: {type:Boolean, required:true},
});


var Team_Schema = new mongoose.Schema({
    teamName: {type:String},
    members: [{name: {type:String, unique: true}}]
});


const Members = mongoose.model('members', Member_Schema);
const Teams = mongoose.model('teams', Team_Schema);

// 1.1
app.post('/member', (req, res) => {
    var body = req.body;
    Members.
    insertMany([{
        full_name: String(body.full_name),
        username: String(body.username),
        password: String(body.password),
        tasks: [{taskName: String(body.taskName), cStat: Boolean(body.cStat)}],
        teams: [{teamName: String(body.teamName)}],
        admin: Boolean(body.admin),
    }])
     .then(data => {
        res.status(200).send(data);
     })
     .catch(err => {
        res.status(400).send(err);
     });
})

// 1.2
app.get('/members', (req, res) => {
    Members.find({})
    .then(data => {
        res.status(200).send(data);
     })
     .catch(err => {
        res.status(400).send(err);
     });
});

// 1.3
app.get('/member/:fullname', (req, res) => {
    Members.find({full_name: String(req.params.fullname)})
    .then(data => {
        res.status(200).send(data);
     })
     .catch(err => {
        res.status(400).send(err);
     });
});

// 1.4
app.post('/completion/:fullname/:taskname',  (req, res) => {
    Members.updateMany({full_name: String(req.params.fullname)},
    { $pull: { tasks: {taskName: String(req.params.taskname)} }}
    )
    .then(data => {
        res.status(200).send(data);
     })
     .catch(err => {
        res.status(400).send(err);
     });
});

// 1.5
app.post('/assignTask/:fullname',  (req, res) => {
    var body = req.body;
    Members.updateMany({full_name: String(req.params.fullname)},
    { $push: { tasks: {taskName: String(body.taskName), cStat: Boolean(body.cStat)} }}
    )
    .then(data => {
        res.status(200).send(data);
     })
     .catch(err => {
        res.status(400).send(err);
     });
});


// 2.1 
app.post('/addTeam', (req, res) => {
    var body = req.body;
    Teams.
    insertMany([{
        teamName: String(body.teamName)
    }])
     .then(data => {
        res.status(200).send(data);
     })
     .catch(err => {
        res.status(400).send(err);
     });
})


// 2.2
app.get('/teams', (req, res) => {
    Teams.find({})
    .then(data => {
        res.status(200).send(data);
     })
     .catch(err => {
        res.status(400).send(err);
     });
});


// 2.3
app.post('/addMember/:fullname/:teamname',  (req, res) => {
    Teams.updateMany({teamName: String(req.params.teamname)},
    { $push: { members: {name: String(req.params.fullname)} }}
    )
    .then(data => {
        res.status(200).send(data);
     })
     .catch(err => {
        res.status(400).send(err);
     });
});


app.listen(port, () => {
    console.log("Server listening on port " + port);
});
