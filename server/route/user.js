const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const express = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const {User} = require('../models/user_m')
const {Tcher} = require('../models/tcher_m')
const {authorizing,authortoken} = require('../auth/auth')
const {secretKey} = require('../config/key')
const router = express.Router();

router.post('/register',(req,res)=>{
	const {fullName,email,password,phone,userType,dateOfBirth} = req.body;
	User.findOne({$or:[{email},{phone}]})
		.then(user=>{
			if(user) return res.status(400).json({error:'email or phone exits'})
			const newUser = new User({
				fullName,email,password,phone,userType,dateOfBirth
			})
			
			bcrypt.genSalt(10,(err,salt)=>{
				if(err) return res.status(400).json(err)
				bcrypt.hash(newUser.password,salt,(err,hash)=>{
					if(err) return res.status(400).json(err)
					newUser.password=hash;
					newUser.save()
						   .then(user=>res.status(200).json(user))
						   .catch(console.log)
				})
			})
		})
		.catch(console.log)
	
})

router.post('/login',(req,res)=>{
	const {email,password} = req.body;
	User.findOne({email})
		.then(user=>{
			if(!user) return res.status(400).json({error:'email wrong'})
			bcrypt.compare(password,user.password)
					.then(isMatch=>{
						if(!isMatch) return res.status(400).json({error:'password is wrong'})
						const payload={
							id: user._id,
							fullName: user.fullName,
							email: user.email,
							userType: user.userType
						};
						
						const token =jwt.sign(
							payload,
							'abcxyz12345',	
						)
						res.cookie('access_cookie','Bearer'+ token,{
							maxAge:365*24*60*60*100, //thoi gian song
							httpOnly:true, //chi http moi doc
							//secure:true  //ssl neu co, neu chay lo calhost thi comment lai
						})
						res.status(200).json({ok:true})
						//user.tokens= user.tokens.concat({token});
						//user.save()
						// 	.then(user=>res.status(200).json(user))
						// 	.catch(console.log)
						//res.send({user,token})
					})
		})
})

router.post('/tcher/createProfile',
			passport.authenticate('jwt',{session:false}),
			authorizing('GV'),
			(req,res)=>{
				// const token = req.cookies.access_cookie
				// console.log('cookie>>>', token);
				const {skills} = req.body;
				Tcher.findOne({userId:req.user.id})
					.then(tcher=>{
						if(tcher) return res.status(400).json(tcher)
						const newTcher = new Tcher({
							skills,userId:req.user.id
						})
						newTcher.save()
							.then(tcher=>{return res.status(200).json(tcher)})
							.catch(console.log)
					})
				 
			}

)




module.exports = router;