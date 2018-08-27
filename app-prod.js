'use strict';

// ================================================================
// get all the tools we need
// ================================================================


const ejs = require('ejs')
const bodyParser = require('body-parser')
const {Client} = require('pg')
const dotenv = require('dotenv')

const Sequelize = require('sequelize')

// const connectionString = 'postgresql://postgres:software@localhost:5432/article';




// =================================end comments code========================
var express = require('express');
var routes = require('./routes/index.js');
var PORT = process.env.PORT || 3000;

var app = express();

// ================================================================
// setup our express application
// ================================================================

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))


app.use('/public', express.static(process.cwd() + '/public'));
app.set('view engine', 'ejs');


// ================================================================
// create a database table by sequelize
// ================================================================

const result = dotenv.config();

dotenv.load();

const postgres_user = process.env.DB_USER;
const postgres_pass = process.env.DB_PASS;

const client = new Client({ connectionString:process.env.DB_URL, ssl: true})

const Op = Sequelize.Op
const sequelize = new Sequelize(process.env.DATABASE_URL,  {


	logging: true,
	ssl: true,
	dialect: 'postgres',
	protocol: 'postgres',
	operatorsAliases:{
		$and: Op.and,
		$or: Op.or,
		$eq: Op.eq,
		$regexp: Op.regexp,
		$iRegexp: Op.iRegexp,
		$like: Op.like,
		$iLike: Op.iLike
	}
})

//____________________________________CREATE A TABLE

const User = sequelize.define('comments',
  {
	username: Sequelize.STRING,
	title: Sequelize.STRING,
	body: Sequelize.STRING,

  }
)

sequelize.sync()


// ================================================================
// the comments code
// ================================================================
//  add comments..
app.post('/add', (req, res)=>{
    const client = new Client({
        connectionString: connectionString,
    })
    client.connect()
    .then(()=>{
        return client.query(`INSERT INTO comments (username, title, body) values($1, $2, $3)`, [req.body.username, req.body.title, req.body.body])
        //id=&1 == [req.params.id] its a query method
    })
    .then((result)=>{
        return res.redirect('/')
    })
})
//  get info..
app.get('/', (req, res)=>{
    const client = new Client({
        connectionString: connectionString,
    })
    client.connect()
    .then(()=>{
        return client.query(`SELECT * FROM comments`)
        // comments its the table we create in article db
    })
    .then((result)=>{
        return res.render('pages/index', {result}) // 'index' its the file name
        //render my html or ejs
    })
})

//to delete
app.post('/delete/comments/:id', (req, res)=>{
    const client = new Client({
        connectionString: connectionString,
    })
    client.connect()
    .then(()=>{
        return client.query(`DELETE FROM comments WHERE id=$1`, [req.params.id])
        //id=&1 == [req.params.id] its a query method
    })
    .then((result)=>{
        return res.redirect('/')
    })
})




// ================================================================
// setup routes
// ================================================================
routes(app);

// ================================================================
// start our server
// ================================================================


app.listen(PORT, ()=>{
	console.log( "port running on 3000")
})