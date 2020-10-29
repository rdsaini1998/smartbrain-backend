const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const port = 4000;

const auth = require('./controllers/authentication.js');
const profile = require('./controllers/profile.js');
const image = require('./controllers/image.js');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'Rishabh@1998',
    database : 'smartbrain'
  }
});

const app = express();

app.use(express.json());
app.use(cors());

app.get('/',(req,res) => {
	res.json({message : 'This is the Smartbrain App server!'});
});

app.post('/signin',auth.handleSignIn(db,bcrypt)); // Javascript Syntax covered in advanced functions

app.post('/register',(req,res) => auth.handleNewRegistration(req,res,db,bcrypt));

app.get('/profile/:id',(req,res) => profile.getProfileWithId(req,res,db));

app.put('/image',(req,res) => image.handleNewImage(req,res,db));

app.post('/imageUrl',(req,res) => image.handleClarifaiCall(req,res));

app.listen(port,() => {
	console.log(`Smartbrain server running on port ${port}`)
});