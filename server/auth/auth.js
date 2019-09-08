const {User} = require('../models/user_m')
const jwt = require('jsonwebtoken')

function authorizing(userType){
	return (req,res,next)=>{
		if(req.user.userType===userType)
		{
			return next()
		}
		res.status(401).json({error:'No permission'})
	}

}
const  authortoken= (req,res,next)=>{
	const token = req.header('Authorization').replace('Bearer ','');
	const data = jwt.verify(token,'abcxyz12345')
	try{
		const user = User.findOne({_id: data._id, 'tokens.token':token})
		if(!user){
			throw new Error()
		}
		req.user = user
		req.token = token

		next()
			
	}catch(error){
		res.status(401).send({error:'Not authorized to access this resoure'})
	}
}
module.exports={authorizing,authortoken}