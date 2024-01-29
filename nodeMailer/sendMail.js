const nodeMailer=require('nodemailer');
const email=('sshanhar3@gmail.com');
console.log(email);
const sendMail=async(email,otp)=>{
    const transporter=nodeMailer.createTransport({
        host:"smtp.gmail.com",
        port:465,
        secure:true,
        auth:{
            user:"sshanhar3@gmail.com",
            pass:"ttbp qatr laqg fapr"
        }
    });
    const info =await transporter.sendMail({
        from:'nodeMailer"<sshanhar3@gmail.com>',
        to:email,
        subject:"Reset password",
        html:`<h2>${otp}</h2>`
    })
}
module.exports=sendMail

