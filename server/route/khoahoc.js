const express = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const { authorizing } = require('../auth/auth')
const { Tcher } = require('../models/tcher_m')
const { KhoaHoc } = require('../models/khoahoc_m')

const router = express.Router()

router.post('/createKH',
    passport.authenticate('jwt', { session: false }),
    authorizing('GV'),
    (req, res) => {
        const { name, timeStart, timeEnd, cost } = req.body;
        KhoaHoc.findOne({ name: name, timeStart: timeStart })
            .then(khoahoc => {

                if (khoahoc)
                    return res.status(400).json({ error: "Kh exits" })
                const newKH = new KhoaHoc({
                    name, timeStart, timeEnd, cost, userId: req.user.id
                })
                newKH.save()
                    .then(kh => {
                        Tcher.findOne({userId:newKH.userId})
                             .then(tcher=>{
                                 tcher.kh_current.push(newKH)
                                 tcher.save()
                                      .then(tcher=>res.status(200).json({tcher:tcher,kh:kh}))
                                      .catch(console.log)
                             })
                        
                    })
                        
                    .catch(console.log)
            })

    }
)

router.post('/book-kh/:khID',
            passport.authenticate('jwt',{session:false}),
            authorizing('HV'),
            (req,res)=>{
                const userID= req.user.id;
                const khId=req.params.khId;
                KhoaHoc.findById(khId)
                        .then(kh=>{
                            if(!kh)return res.status(400).json(khId)
                            kh.hvtotal+=1;
                            kh.hvCurrent.push(req.user)
                            kh.save()
                              .then(kh=>{return res.status(200).json(kh)})
                              .catch(console.log)
                        })
            }
)


module.exports = router;