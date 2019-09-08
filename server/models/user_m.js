const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
	fullName:{type:String, require:true},
	email:{type:String, require:true},
	password:{type:String, require:true},
	userType:{type:String, require:true},
	phone:{type:String, require:true},
	dateOfBirth:{type:String}
})

const User = mongoose.model('User',UserSchema)

module.exports={User,UserSchema};