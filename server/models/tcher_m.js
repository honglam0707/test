const mongoose = require('mongoose')
const {KhoahocSchema} = require('./khoahoc_m')
const tcherSchema = new mongoose.Schema({
	userId:{type: mongoose.Schema.Types.ObjectId,
		ref:'User',
		required:true
	},
	skills:{type:String,required:true},
	kh_current:{type:[String]},
	kh_total:{type:Number, default:0}
})

const Tcher = mongoose.model('Tcher', tcherSchema);

module.exports={Tcher,tcherSchema};