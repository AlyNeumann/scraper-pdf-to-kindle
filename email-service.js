const nodemailer = require("nodemailer");
const nodemailerSendgrid = require("nodemailer-sendgrid");

module.exports.sendToKindle = async (title, email) => {
  const transporter = nodemailer.createTransport(
    nodemailerSendgrid({
         apiKey: process.env.SENDGRID_API_KEY
      })
    );

  let info = await transporter.sendMail({
    from: '"Another Fruit 🍍🥝" <no-reply@anotherfruit.com>',
    to: `neumannbooking@gmail.com, ${email}`,
    subject: "Hello from Another Fruit",
    text: "Here is your PDF!",
    html: "<b>Here is your PDF!</b>",
    attachments: [{
      filename: `${title}.pdf`,
      path: `./${title}.pdf`,
      contentType: 'application/pdf'
    }],
    function(err, info) {
      if (err) {
        console.error(err);
      } else {
        console.log(info);
      }
    }
  });
  console.log(`email sent : ${JSON.stringify(info)}`)
  if(info[0].statusMessage === 'Accepted'){
    return true
  }
  else{
    return false
  }
}
