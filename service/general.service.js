const axios = require('axios');

const getDataFormCase = (token) => {

    const urlBase = process.env.URL_GET_CLASS

    const urlAddress = `${urlBase}/GetTestCustomClass`

    return new Promise((resolve, reject) => {

        axios.post(urlAddress, params, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })
        .then((response) => console.log('llega aqui mi resp', response.data))
        // axios.request(config)
        //     .then((response) => console.log(response))
        //     // .then((result) => {
        //     //     resolve({ success: true, data: result });
        //     // })
        //     .catch((error) => {
        //         reject({
        //             success: false,
        //             status: error.response.status,
        //             statusText: error.response.statusText
        //         })
        //     })

    });
};

module.exports = getDataFormCase;