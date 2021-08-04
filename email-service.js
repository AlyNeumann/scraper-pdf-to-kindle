const nodemailer = require("nodemailer");

module.exports.sendToKindle = async (folderId, source) => {
    // use this if outlook wont work
    // let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
        // pool: true,
        // host: "smtp-mail.outlook.com",
        // port: 465,
        // secure: true,
        service: "hotmail",
        auth: {
          user: "aly_neum@hotmail.com", 
          pass: "MyOldTH7711!", 
        },
        // tls: {
        //     rejectUnauthorized: false
        //   }
      });

      let info = await transporter.sendMail({
        from: '"Another Fruit 🍍" <aly_neum@hotmail.com>', // sender address
        to: "neumannbooking@gmail.com, aly_neum@hotmail.com, maysam.shahsavari@gmail.com", // list of receivers
        subject: "Hello, here is an EMAIL", // Subject line
        text: "Text Body stuffffff", // plain text body
        html: "<b>Do we need html? No...</b>", // html body,
        attachments: [{
            filename: `${source}.pdf`,
            path: `./${folderId}/${source}.pdf`,
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
      console.log(`email sent : ${info}`)
}