const axios = require('axios');

const getEmployeeByCodePersonal = (code, token) => {
    const urlBase = process.env.URL_GET_CLASS;
    const url = `${urlBase}/GetLHEmployeeInformation`
    let rawData = JSON.stringify({ _json: `{\"Personnelnumber\":\"${code}\"}` });
    return new Promise((resolve, reject) => {
        let config = {
            method: 'post',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            data: rawData
        };
        axios.request(config)
            .then((response) => {
                const { data } = response;
                const dataUser = JSON.parse(data);
                const { Received } = dataUser;
                const { PersonnelNumber, PartyNumber, Name, NameAlias, PrimaryContactEmail } = JSON.parse(Received);
                const resultEmp = { PersonnelNumber, PartyNumber, Name, NameAlias, PrimaryContactEmail };
                return resolve({ success: true, data: resultEmp });
            })
            .catch((error) => {
                return reject({
                    success: false,
                    data: error
                })
            })


    });
};

const sendRequestAccess = (name, personal_id, token) => {
    return new Promise((resolve, reject) => {
        const urlBase = process.env.URL_BASE;
        const url = `${urlBase}/PersonIdentificationNumbers`;

        let config = {
            method: 'get',
            url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        };

        axios.request(config)
            .then((response) => response.data)
            .then(({ value }) => {
                const idFiltered = value.filter((item) => item.IdentificationNumber === personal_id);
                if (!idFiltered.length) {
                    return resolve({ success: false, data: idFiltered, message: 'Su Identificacion es incorrecta' })
                }
                return resolve({ success: true, data: idFiltered, message: 'Su solicitud fue enviada a recursos humanos' });
            })
            .catch((error) => {
                reject({
                    success: false,
                    status: error.response.status,
                    statusText: error.response.statusText
                })
            })

    })
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
                'Authorization': `Bearer ` + token
            }
        };

        axios.request(config)
            .then((response) => response.data)
            .then((result) => {
                resolve({ success: true, data: result });
            })
            .catch((error) => {
                reject({
                    success: false,
                    status: error.response.status,
                    statusText: error.response.statusText
                })
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
                'Authorization': 'Bearer ' + token
            }
        };

        axios.request(config)
            .then((response) => response.data)
            .then((result) => {
                resolve({ success: true, data: result });
            })
            .catch((error) => {
                reject({
                    success: false,
                    status: error.response.status,
                    statusText: error.response.statusText
                })
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
                'Authorization': 'Bearer ' + token
            }
        };

        axios.request(config)
            .then((response) => response.data)
            .then((result) => {
                const newcontact = [];
                result.value.map((item) => {
                    delete item["@odata.etag"];
                    let d = {
                        ...item,
                        Name: item.ContactFirstName + ' ' + item.ContactMiddleName + ' ' + item.ContactLastName,
                    }
                    newcontact.push(d);
                });
                resolve({ success: true, data: newcontact });
            })
            .catch((error) => {
                reject({
                    success: false,
                    status: error.response.status,
                    statusText: error.response.statusText
                })
            })

    });

};

const getPersonalIdsByEmployee = (num, token) => {
    const urlBase = process.env.URL_BASE
    const urlAddress = `${urlBase}/PersonIdentificationNumbers?$filter=PartyNumber eq \'${num}\'`

    return new Promise((resolve, reject) => {

        let config = {
            method: 'get',
            url: urlAddress,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        };

        axios.request(config)
            .then((response) => response.data)
            .then((result) => {
                resolve({ success: true, data: result.value });
            })
            .catch((error) => {
                reject({
                    success: false,
                    status: error.response.status,
                    statusText: error.response.statusText
                })
            })

    });
};

const getPaymentsMethodsByEmp = (num, token) => {
    const urlBase = process.env.URL_BASE
    const urlAddress = `${urlBase}/WorkerBankAccounts?$filter=PersonnelNumber eq \'${num}\'`

    return new Promise((resolve, reject) => {

        let config = {
            method: 'get',
            url: urlAddress,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        };

        axios.request(config)
            .then((response) => response.data)
            .then((result) => {
                resolve({ success: true, data: result });
            })
            .catch((error) => {
                reject({
                    success: false,
                    status: error.response.status,
                    statusText: error.response.statusText
                })
            })

    });
};


module.exports = {
    getEmployeeByCodePersonal,
    sendRequestAccess,
    getAddressByEmployee,
    getContactDetailsByEmployee,
    getPersonalContactsByEmployee,
    getPersonalIdsByEmployee,
    getPaymentsMethodsByEmp
}