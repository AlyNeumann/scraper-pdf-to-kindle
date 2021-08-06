const nodemailer = require("nodemailer");

module.exports.sendToKindle = async (title) => {
  let transporter = nodemailer.createTransport({
    // pool: true,
    // host: "smtp-mail.outlook.com",
    // port: 465,
    // secure: true,
    service: "hotmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
    tls: {
        rejectUnauthorized: false
      }
  });

  let info = await transporter.sendMail({
    from: '"Another Fruit 🍍🥝" <aly_neum@hotmail.com>',
    to: "neumannbooking@gmail.com, aly_neum@hotmail.com",
    subject: "Hello, here is an EMAIL",
    text: "Text Body stuffffff",
    html: "<b>Do we need html? No...</b>",
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
  return info.accepted;
}