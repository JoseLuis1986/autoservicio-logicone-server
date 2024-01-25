const axios = require('axios');
const dayjs = require('dayjs');
const getDatesBetween = require('../helpers/getDatesBetween');

const getPaymentsByEmployee = ({ Personnelnumber, Name, PeriodStartDate, PeriodEndDate }, token) => {
    return new Promise((resolve, reject) => {
        /* https://usnconeboxax1aos.cloud.onebox.dynamics.com/data/PayStatementHeaders?$filter=PersonnelNumber 
           eq '000020' and PeriodStartDate ge 2015-12-22T12:00:00Z and PeriodEndDate le 2016-01-31T12:00:00Z
        */
        const urlBase = process.env.URL_BASE
        const url1 = `${urlBase}/PayStatementHeaders?$filter=PersonnelNumber eq \'${Personnelnumber}\' and PeriodStartDate ge ${PeriodStartDate} and PeriodEndDate le ${PeriodEndDate}`
        // const url2 = `${urlBase}/PayrollUSTaxTransactionSummaries?$filter=PersonnelNumber eq \'${num}\'`
        let config = {
            method: 'get',
            url: url1,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        };
        axios.request(config)
            .then((response) => response.data)
            .then(({ value }) => {
                const newPay = [];
                value.map((item) => {
                    delete item["@odata.etag"];
                    let d = {
                        ...item,
                        Name,
                        PayPeriod: item.PeriodStartDate + "  " + item.PeriodEndDate,
                        PaymentDate: dayjs(item.PaymentDate).format('YYYY-MM-DD'),
                        PeriodStartDate: dayjs(item.PeriodStartDate).format('YYYY-MM-DD'),
                        PeriodEndDate: dayjs(item.PeriodEndDate).format('YYYY-MM-DD')
                    }
                    newPay.push(d);
                });
                // newPay.sort();
                newPay.reverse()
                resolve({ success: true, data: newPay });
            })
            .catch((error) => {
                console.log(error)
                reject({
                    success: false,
                    status: error.response.status,
                    statusText: error.response.statusText
                })
            })
    })
}

const getLeaveAndAbsenseByEmployee = (num, token) => {
    return new Promise((resolve, reject) => {
        const urlBase = process.env.URL_BASE
        const url1 = `${urlBase}/EssLeaveBalances?$filter=PersonnelNumber eq \'${num}\'`
        let config = {
            method: 'get',
            url: url1,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        };
        axios.request(config)
            .then((response) => response.data)
            .then(data => {
                if (data.value.length === 0) {
                    resolve({ success: true, data: [] });
                } else {
                    resolve({ success: true, data: data.value });
                }
            })
            .catch((error) => {
                reject({
                    success: false,
                    status: error.response.status,
                    statusText: error.response.statusText
                })
            })
    })
}

const timeOffApprovedByEmployee = (num, token) => {
    return new Promise((resolve, reject) => {
        const urlBase = process.env.URL_BASE
        const url1 = `${urlBase}/EssLeaveTimeOffDates?$filter=PersonnelNumber eq \'${num}\'`
        let config = {
            method: 'get',
            url: url1,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        };
        axios.request(config)
            .then((response) => response.data)
            .then(({ value }) => {
                if (value.length === 0) {
                    resolve({ success: true, data: [] });
                } else {
                    let dt = [];
                    value.map((item) => {
                        delete item["@odata.etag"];
                        let d = {
                            ...item,
                            RequestDate: dayjs(item.RequestDate).format('YYYY-MM-DD')
                        }
                        dt.push(d);
                    });
                    resolve({ success: true, data: dt });
                }
            })
            .catch((error) => {
                reject({
                    success: false,
                    status: error.response.status,
                    statusText: error.response.statusText
                })
            })
    })
}


const timeOffRequestByEmployee = (num, token) => {
    return new Promise((resolve, reject) => {
        const urlBase = process.env.URL_BASE
        const url1 = `${urlBase}/EssLeaveRequestAssignedHeaders?$filter=PersonnelNumber eq \'${num}\'`
        let config = {
            method: 'get',
            url: url1,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        };
        axios.request(config)
            .then((response) => response.data)
            .then(({ value }) => {
                if (value.length === 0) {
                    resolve({ success: true, data: [] });
                } else {
                    let dt = [];
                    value.map((item) => {
                        delete item["@odata.etag"];
                        let d = {
                            ...item,
                            RequestDate: dayjs(item.RequestDate).format('YYYY-MM-DD'),
                            StartDate: dayjs(item.StartDate).format('YYYY-MM-DD'),
                            EndDate: dayjs(item.EndDate).format('YYYY-MM-DD')
                        }
                        dt.push(d);
                    });
                    dt.reverse()
                    resolve({ success: true, data: dt });
                }
            })
            .catch((error) => {
                reject({
                    success: false,
                    status: error.response.status,
                    statusText: error.response.statusText
                })
            })
    })
}

const timeOffRequestByEmployeeByDate = ({
    PersonnelNumber,
    StartDate,
    EndDate,
    token }) => {
        console.log(PersonnelNumber);
    return new Promise((resolve, reject) => {
        const urlBase = process.env.URL_BASE
        const url1 = `${urlBase}/EssLeaveRequestAssignedHeaders?$filter=PersonnelNumber eq \'${PersonnelNumber}\' and StartDate ge ${StartDate} and EndDate le ${EndDate}`
        let config = {
            method: 'get',
            url: url1,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        };
        axios.request(config)
            .then((response) => response.data)
            .then(({ value }) => {
                if (value.length === 0) {
                    resolve({ success: true, data: [] });
                } else {
                    let dt = [];
                    value.map((item) => {
                        delete item["@odata.etag"];
                        let d = {
                            ...item,
                            RequestDate: dayjs(item.RequestDate).format('YYYY-MM-DD'),
                            StartDate: dayjs(item.StartDate).format('YYYY-MM-DD'),
                            EndDate: dayjs(item.EndDate).format('YYYY-MM-DD')
                        }
                        dt.push(d);
                    });
                    dt.reverse()
                    resolve({ success: true, data: dt });
                }
            })
            .catch((error) => {
                reject({
                    success: false,
                    status: error.response.status,
                    statusText: error.response.statusText
                })
            })
    })
}

const getTypeLeaveByEmployee = (num, token) => {
    return new Promise((resolve, reject) => {
        const baseUrl = process.env.URL_BASE;
        const url = `${baseUrl}/LeaveEnrollments?$filter=PersonnelNumber eq \'${num}\'`;
        let config = {
            method: 'get',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        };
        axios.request(config)
            .then((res) => res.data)
            .then(({ value }) => {
                if (value.length === 0) {
                    resolve({ success: true, data: [] });
                } else {
                    let dt = [];
                    value.map((item) => {
                        dt.push(item.LeaveType);
                    });
                    resolve({ success: true, data: dt });
                }
            })
            .catch((error) => {
                reject({
                    success: false,
                    status: error.response.status,
                    statusText: error.response.statusText
                })
            });
    })
}

/*
{
    "dataAreaId": "usmf",
    "PersonnelNumber": "000020",
    "Comment": "Dolor de cuello",
    "LeaveType": "Sick",
    "LeaveDate": "2023-12-20T12:00:00Z"
}
*/

const requestTimeOffByEmployee = (data, token) => {
    const baseUrl = process.env.URL_BASE;
    const url1 = `${baseUrl}/MyLeaveRequests`
    const { startDate, endDate, PersonnelNumber, LeaveType, Comment } = data
    const datos = {
        LeaveDate: dayjs(startDate).format('YYYY-MM-DD'),
        PersonnelNumber,
        LeaveType,
        Comment
    }
    async function startDateLeaveAbsence(params) {
        const response = await axios.post(url1, params, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        const result = response.data;
        return result;
    }
    /*
    Resultado de la primera insercion del tipo de solicitud con la fecha inicial
    { 
        dataAreaId: 'usmf',
        RequestId: 'USMF-000027',
        LeaveType: 'Sick',
        LeaveDate: '2024-01-09T12:00:00Z',
        ReasonCodeId: '',
        PersonnelNumber: '000020',
        RequestDate: '1900-01-01T12:00:00Z',
        Comment: 'Dolor de muelas',
        Status: 'Draft',
        Amount: 0,
        HalfDayDefinition: 'None'
    } 
    */
    return new Promise((resolve, reject) => {

        startDateLeaveAbsence(datos)
            .then((data) => {
                console.log(data);
                const { RequestId, LeaveType } = data;
                const datesArray = getDatesBetween(startDate, endDate);
                delete datesArray[0];
                datesArray?.map((date) => {
                    let newData = {
                        RequestId,
                        LeaveType,
                        LeaveDate: dayjs(date).format('YYYY-MM-DD')
                    };
                    startDateLeaveAbsence(newData)
                })
                resolve({ success: true, data });
            })
            .catch((error) => {
                reject({
                    success: false,
                    status: error.response.status,
                    statusText: error.response.statusText
                })
            });
    })
}

const payStatementEarningLine = (token, num, paystatement) => {
    const baseUrl = process.env.URL_BASE;
    const url1 = `${baseUrl}/PayStatementEarningLineInquiries?$filter=PersonnelNumber eq \'${num}\' and PayStatementNumber eq \'${paystatement}\'`
    return new Promise((resolve, reject) => {
        let config = {
            method: 'get',
            url: url1,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        };
        axios.request(config)
            .then((res) => res.data)
            .then(({ value }) => {
                if (value.length === 0) {
                    resolve({ success: true, data: [] });
                } else {
                    resolve({ success: true, data: value });
                }
            })
            .catch((error) => {
                reject({
                    success: false,
                    status: error.response.status,
                    statusText: error.response.statusText
                })
            })
    })
}

const accumulationEarnings = (paystatement, token) => {
    const baseUrl = process.env.URL_BASE;
    // PayStatementAccrualBalances?$filter=PayStatementNumber eq 'USMF-00005171'
    const url1 = `${baseUrl}/PayStatementAccrualBalances?$filter=PayStatementNumber eq \'${paystatement}\'`
    return new Promise((resolve, reject) => {
        let config = {
            method: 'get',
            url: url1,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        };
        axios.request(config)
            .then((res) => res.data)
            .then(({ value }) => {
                if (value.length === 0) {
                    resolve({ success: true, data: [] });
                } else {
                    resolve({ success: true, data: value });
                }
            })
            .catch((error) => {
                reject({
                    success: false,
                    status: error.response.status,
                    statusText: error.response.statusText
                })
            })
    })
}

/*
recibo el PayStatementNumber por parametros
https://usnconeboxax1aos.cloud.onebox.dynamics.com/data/PayStatementBenefitLineInquiries?$filter=PayStatementNumber eq 'USMF-00002577'
extraigo el BenefitId de la consulta anterior y consulto con este nuevo endpoint  
https://usnconeboxax1aos.cloud.onebox.dynamics.com/data/Benefits?$filter=BenefitId eq '000001'
extraigo y concateno los campos que necesito
{
        "@odata.etag": "W/\"JzAsNjg3MTk1NTc3NjEn\"",
        "PayStatementNumber": "USMF-00002577",
        "LineNum": 2,
        "PersonnelNumber": "000020",
        "AccountingCurrencyAmount": 248.79,
        "PremiumEarningBaseHours": 0,
        "PeriodEndDate": "2016-01-15T12:00:00Z",
        "IsEmployer": "No",
        "BaseTimeEarningBaseHours": 85.479,
        "PremiumEarningBaseAmount": 0,
        "PayCycleId": "sm",
        "Source": "WorkerEnrolledBenefit",
        "PositionId": "",
        "Worker": "Julia Funderburk",
        "Description": "401(k) plan",
        "PeriodStartDate": "2016-01-01T12:00:00Z",
        "BaseTimeEarningBaseAmount": 8292.88,
        "AccountingDate": "2016-01-15T12:00:00Z",
        "BenefitId": "000001",
        "VendorInvoice": ""
    },
    {
        "@odata.etag": "W/\"JzAsMTEyOTA5MjMwNzAn\"",
        "BenefitPlanId": "401k",
        "BenefitOptionId": "Participate",
        "Effective": "2005-01-01T08:00:00Z",
        "Expiration": "2154-12-31T23:59:59Z",
        "BenefitId": "000001"
    }
*/
const deductionsOfBenefitByEmployee = async (batch, token) => {

    try {
        const baseUrl = process.env.URL_BASE;
        const url1 = `${baseUrl}/PayStatementBenefitLineInquiries?$filter=PayStatementNumber eq \'${batch}\'`;
        const response = await axios.get(url1, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
        const result = await response.data;
        return await Promise.all(
            result.value.map(async (item) => {
                const url2 = `${baseUrl}/Benefits?$filter=BenefitId eq \'${item.BenefitId}\'`;
                const benefit = await axios.get(url2, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                })
                const result1 = await benefit.data;
                const val = result1.value[0];

                delete item['@odata.etag']
                delete item['BenefitId'];
                delete val['@odata.etag']

                const endResult = {
                    ...item,
                    ...val
                }

                return endResult;
            }))

    } catch (error) {
        reject({
            success: false,
            status: error.response.status,
            statusText: error.response.statusText
        })
    }
}

const deductionsImpuestos = async (batch, token) => {
    const baseUrl = process.env.URL_BASE;
    //https://usnconeboxax1aos.cloud.onebox.dynamics.com/data/PayStatementTaxLines?$filter=PayStatementNumber eq 'USMF-00005171'
    const url = `${baseUrl}/PayStatementTaxLines?$filter=PayStatementNumber eq \'${batch}\'`;

    return new Promise((resolve, reject) => {
        let config = {
            method: 'get',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }

        axios.request(config)
            .then((res) => res.data)
            .then(({ value }) => {
                if (value.length === 0) {
                    resolve({ success: true, data: [] });
                } else {
                    resolve({ success: true, data: value });
                }
            })
            .catch((error) => {
                reject({
                    success: false,
                    status: error.response.status,
                    statusText: error.response.statusText
                })
            })
    })

}

module.exports = {
    getPaymentsByEmployee,
    getLeaveAndAbsenseByEmployee,
    timeOffRequestByEmployee,
    timeOffRequestByEmployeeByDate,
    timeOffApprovedByEmployee,
    getTypeLeaveByEmployee,
    requestTimeOffByEmployee,
    payStatementEarningLine,
    accumulationEarnings,
    deductionsOfBenefitByEmployee,
    deductionsImpuestos
}