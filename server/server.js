const mongoose = require('mongoose')
const express = require('express')
const passport = require('passport')
const cookie_parser = require('cookie-parser')
const cors = require('cors')
const URI = 'mongodb://localhost:27017/mgdb'

mongoose.connect(URI,{useNewUrlParser:true})
		.then(console.log('connected mongodb'))
		.catch(console.log)
const app= express();
//allow cors
app.use(function (req,res,next){
	res.header('Access-Control-Allow-Origin','*');
	res.header('Access-Control-Allow-Headers','Origin, X-Requested-Width, Content-Type,Accept,authorization');
	next();
})
//parser
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(cookie_parser())
app.use(cors({
    origin: 'http://127.0.0.1:1234', //Chan tat ca cac domain khac ngoai domain nay
    credentials: true //Để bật cookie HTTP qua CORS
}))
//passport
app.use(passport.initialize());
require('./config/passport')(passport);
//router
app.use('/users',require('./route/user'))
app.use('/khoahoc',require('./route/khoahoc'))
const port=process.env.PORT||1234

app.listen(port,console.log(`Server on port ${port}`))