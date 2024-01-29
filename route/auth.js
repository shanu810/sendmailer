const express=require('express')
const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User =require('../model/user')
const sendMail=require('../nodeMailer/sendMail')
const router=express.Router()

//user registration 
router.post('/register',async(req,res)=>{
    try {
        const {username,password,mail}=req.body
        const hashedpassword=await bcrypt.hash(password,10)
        const user=new User({username:username,password:hashedpassword,mail:mail})
        await user.save()
        res.status(201).json({message:"User Registered"})
    } catch (error) {
        console.log(error)
        // res.status(500).json({error:"registration failed"})
    }
})

//User login
router.post('/login',async(req,res)=>{
    try {
        const {password,mail}=req.body
        const user=await User.findOne({mail})
        if(!user)
        {
            return res.status(401).json({error:"Authentication failed"})
        }
        const passwordMatch=await bcrypt.compare(password,user,password)
        if(!passwordMatch){
            return res.status(401).json({eeror:"Authentication failed"})

        const token=jwt.sign({ userId:user._id},"secret key",{expiresIn:"1h"})

        res.status(200).json({token})
        }
    } catch (error) {
        console.log(error)
        //res.status(500).json({error:"Login failed"})
    }
})

//forgotpassword
router.post('/forgotpswd',async(req,res)=>{
    try {
        const{username}=req.body
    const user = await User.findOne({ username:username });
    if (!user){
        return res.status(401).json({ message: 'User not found'})
    }
    const otp = Math.floor(Math.random()*100000);
    const updateOtp=await User.findByIdAndUpdate(user._id,{otp},{new:true})
    if(updateOtp){
        sendMail(user.mail,otp);
        res.status(200).json({message:"OTP send to mailid"})
    }

    return res.status(400).json({ message: 'OTP sent failed' });
    } catch (error) {
        console.log(error)
    }
})
module.exports=router