const axios = require('axios');
const nodemailer = require("nodemailer");
const FormData = require('form-data');


const getToken = (values) => {

  return new Promise((resolve, reject) => {
    const {
      resource,
      tenant_id,
      client_id,
      client_secret,
      grant_type
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
        const { access_token } = result;
        resolve({ success: true, msg: 'token generado', token: access_token });
      })
      .catch((error) => {
        // console.log('error de register', error.response.data.error_description);
        // return { error: error.response.data.error_description }
        reject({ success: false, msg: error.response.data.error_description });
      })

  });
};

const sendMail = async (subject, toEmail, otpText, keyaccess) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODE_MAILER_EMAIL,
      pass: process.env.NODE_MAILER_PSSW,
    },
  });

  var mailOptions = {
    from: process.env.NODE_MAILER_EMAIL,
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

const getAddressByEmployee = (num, token) => {

  const urlBase = process.env.URL_BASE

  const urlAddress = `${urlBase}/WorkerPostalAddresses?$filter=PersonnelNumber eq \'${num}\'`

  return new Promise((resolve, reject) => {

    let config = {
      method: 'get',
      url: urlAddress,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      }
    };

    axios.request(config)
      .then((response) => response.data)
      .then((result) => {
        return resolve({ success: true, data: result });
      })
      .catch((error) => {
        return reject(error.message)
        // return reject(error)
        // return { error: error.response.data.error_description }
        // reject({ success: false, data: error.response })
      })

  });
};

const getContactDetailsByEmployee = (num, token) => {

  const urlBase = process.env.URL_BASE
  const urlAddress = `${urlBase}/WorkerContacts?$filter=PersonnelNumber eq \'${num}\'`

  return new Promise((resolve, reject) => {

    let config = {
      method: 'get',
      url: urlAddress,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      }
    };

    axios.request(config)
      .then((response) => response.data)
      .then((result) => {
        resolve({ success: true, data: result });
      })
      .catch((error) => {
        reject(error)
        // return { error: error.response.data.error_description }
        // reject({ success: false, data: error.response.data.error_description })
      })

  });

};

const getPersonalContactsByEmployee = (num, token) => {
  const urlBase = process.env.URL_BASE
  const urlAddress = `${urlBase}/PersonalContactPeople?$filter=WorkerPersonnelNumber eq \'${num}\'`

  return new Promise((resolve, reject) => {

    let config = {
      method: 'get',
      url: urlAddress,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      }
    };

    axios.request(config)
      .then((response) => response.data)
      .then((result) => {
        resolve({ success: true, data: result });
      })
      .catch((error) => {
        reject(error)
        // return { error: error.response.data.error_description }
        // reject({ success: false, data: error.response.data.error_description })
      })

  });

};

const getPersonalIdsByEmployee = (num, token) => {
  //URL= https://usnconeboxax1aos.cloud.onebox.dynamics.com/data/PersonIdentificationNumbers?$filter=PartyNumber eq '000000050'
  const urlBase = process.env.URL_BASE
  const urlAddress = `${urlBase}/PersonIdentificationNumbers?$filter=PartyNumber eq \'${num}\'`

  return new Promise((resolve, reject) => {

    let config = {
      method: 'get',
      url: urlAddress,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      }
    };

    axios.request(config)
      .then((response) => response.data)
      .then((result) => {
        resolve({ success: true, data: result });
      })
      .catch((error) => {
        reject(error)
        // return { error: error.response.data.error_description }
        // reject({ success: false, data: error.response.data.error_description })
      })

  });
};

const getPaymentsMethodsByEmp = (num, token) => {
  // URL = https://usnconeboxax1aos.cloud.onebox.dynamics.com/data/WorkerBankAccounts?$filter=PersonnelNumber eq '000020'
  const urlBase = process.env.URL_BASE
  const urlAddress = `${urlBase}/WorkerBankAccounts?$filter=PersonnelNumber eq \'${num}\'`

  return new Promise((resolve, reject) => {

    let config = {
      method: 'get',
      url: urlAddress,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      }
    };

    axios.request(config)
      .then((response) => response.data)
      .then((result) => {
        resolve({ success: true, data: result });
      })
      .catch((error) => {
        reject(error)
        // return { error: error.response.data.error_description }
        // reject({ success: false, data: error.response.data.error_description })
      })

  });
};

module.exports = {
  getToken,
  sendMail,
  getAddressByEmployee,
  getContactDetailsByEmployee,
  getPersonalContactsByEmployee,
  getPersonalIdsByEmployee,
  getPaymentsMethodsByEmp
}