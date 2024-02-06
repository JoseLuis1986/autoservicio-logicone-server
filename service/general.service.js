const axios = require('axios');

const getDataFormCase = (token) => {

    const urlBase = process.env.URL_GET_CLASS

    const urlAddress = `${urlBase}/GetTestCustomClass`

    return new Promise((resolve, reject) => {

        axios.post(urlAddress, params, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer  ' + token
            }
        })
            .then((response) => resolve({ success: true, data: response.data }))
            .catch((error) => reject({
                success: false,
                status: error.response.status,
                statusText: error.response.statusText
            }))
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

/*
{
    "PartyNumber": "000000077",
    "Category": "10",
    "Description": "Visita al optometrista",
    "CaseCategory": "Recruit",
    "Priority": 2
}
*/
const requestCaseByEmployee = async (data, token) => {
    const baseUrl = process.env.URL_GET_CLASS;
    const url1 = `${baseUrl}/SetLHCaseDetailsByEmployeeCreate`;
    const Category = '10';
    const { PartyNumber, Description, CaseCategory, Priority } = data
    let dataBody = JSON.stringify({
        "_json": `{\"Description\":\"${Description}\",\"CaseCategory\":\"${CaseCategory}\",\"Priority\":${Priority},\"Category\":\"${Category}\",\"PartyNumber\":\"${PartyNumber}\"}`
    });
    console.log(dataBody);

    return new Promise((resolve, reject) => {
        
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: url1,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            data: dataBody
        };
    
        axios.request(config)
            .then((response) => {
    
                const { data } = response;
                const dataReceived = JSON.parse(data);
                const { Received, CodigoError, DescripcionError } = dataReceived
                const respuesta = JSON.parse(Received);
                console.log('rsultados de mi consulta', respuesta);
                resolve({ success: true, data: respuesta })
            })
            .catch((error) => {
                reject(error);
            });
    })

}

module.exports = {
    getDataFormCase,
    requestCaseByEmployee
};