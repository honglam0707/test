const mongoose = require('mongoose')
const {UserSchema} = require('./user_m')
const KhoahocSchema = new mongoose.Schema({
	userId:{type:mongoose.Schema.Types.ObjectId,
		ref:'User',
		required:true
	},
	name:{type:String, require:true},
	timeStart:{type:String, require:true},
	timeEnd:{type:String, require:true},
	cost:{type:Number, default:0},
	hvCurrent:[UserSchema],
	hvtotal:{type:Number, default:0},
	isTrue:{type:Boolean,default:false,required:true},
	isFinish:{type:Boolean,default:false,required:true}
})

const KhoaHoc = mongoose.model('KhoaHoc',KhoahocSchema)

module.exports={KhoaHoc,KhoahocSchema}