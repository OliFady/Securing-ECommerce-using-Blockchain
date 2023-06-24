const nodemailer = require("nodemailer")

const sendEmail = async (options)=>{
  /*const transporter = nodemailer.createTransport({
    service:process.env.EMAIL_HOST,
    port:process.env.EMAIL_PORT,
    auth:{
      user:process.env.EMAIL_USERNAME,
      pass:process.env.EMAIL_PASSWORD
    }
  })*/

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'seamus.farrell90@ethereal.email',
        pass: 'QV1gveyJMXkCWK9aSn'
    }
});

  const mailOptions={
    from:"Oliver Fady <NeedItSupport@NeedIt.com",
    to:options.email,
    subject:options.message
  }

  await transporter.sendMail(mailOptions)
}

module.exports = sendEmail
