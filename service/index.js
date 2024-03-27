const axios = require('axios');
const nodemailer = require("nodemailer");
const FormData = require('form-data');
const { getConfigurationEntitie } = require('../controllers/configupdate.controller');
const Configuration  = require('../models/configuration');


const getToken = (values) => {

  return new Promise((resolve, reject) => {
    const {
      resource,
      tenant_id,
      client_id,
      client_secret,
      grant_type,
    } = values;

    let data = new FormData();
    data.append('grant_type', `${grant_type}`);
    data.append('client_id', `${client_id}`);
    data.append('client_secret', `${client_secret}`);
    data.append('resource', `${resource}`);

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://login.microsoftonline.com/${tenant_id}/oauth2/token`,
      headers: {
        'Cookie': 'fpc=AhRd1HaGq51PoupPS4_VfPm_VOVHAQAAAEDdA90OAAAA',
        ...data.getHeaders()
      },
      data: data
    };

    axios.request(config)
      .then((response) => response.data)
      .then((result) => {
        resolve({ success: true, msg: 'token generado', token: result });
      })
      .catch((error) => {
        reject({ success: false, msg: error.response.data.error_description });
      })

  });
};

const sendMail = async (subject, toEmail, otpText, keyaccess) => {

  //Obtengo el email y passw corporativo desde mi db mongodb
  const { email, email_pass } = await Configuration.findOne();

  const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
      user: email,
      pass: email_pass
    },
    // tls: {
    //   rejectUnauthorized: false
    // }
  })
  // var transporter = nodemailer.createTransport({
  //   service: "gmail",
  //   auth: {
  //     user: process.env.NODE_MAILER_EMAIL,
  //     pass: process.env.NODE_MAILER_PSSW,
  //   },
  // });

  var mailOptions = {
    from: email,
    to: toEmail,
    subject: subject,
    text: otpText,
    html: `<h1>Esta es su clave de acceso al autoservicio de logicone</h1><br><p>${keyaccess}</p>`
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      // throw new Error(error);
      console.log('hubo un error')
    } else {
      console.log("Email Sent");
      console.log("Message sent: %s", info.messageId);
      return true;
    }
  });
};


module.exports = {
  getToken,
  sendMail,
}