const { response } = require('express');
const axios = require('axios');
const { 
  getPaymentsByEmployee, 
  getLeaveAndAbsenseByEmployee, 
  timeOffApprovedByEmployee, 
  timeOffRequestByEmployee, 
  requestTimeOffByEmployee, 
  getTypeLeaveByEmployee, 
  payStatementEarningLine, 
  accumulationEarnings,
  deductionsOfBenefitByEmployee, 
  deductionsImpuestos
} = require('../service/payments.service');
const dayjs = require('dayjs');


const getAllPayments = async (req, res = response) => {
  const Personnelnumber = req.query.PersonnelNumber;
  const Name = req.query.Name;
  const personal = { Personnelnumber, Name }
  const token = req.headers['authorization'];
  try {
    const resp = await getPaymentsByEmployee(personal, token);
    res.json({ ok: true, data: resp.data })
  } catch (error) {
    return res.json(error)
  }
};

const getLeaveAndAbsence = async (req, res = response) => {
  const PersonnelNumber = req.query.PersonnelNumber;
  const token = req.headers['authorization'];
  try {
    const resp = await getLeaveAndAbsenseByEmployee(PersonnelNumber, token)
    res.json({ ok: true, data: resp.data })
  } catch (error) {
    return res.json(error)
  }
};

const approvedTimeOff = async (req, res = response) => {
  const PersonnelNumber = req.query.PersonnelNumber;
  const token = req.headers['authorization'];
  try {
    const resp = await timeOffApprovedByEmployee(PersonnelNumber, token)
    res.json({ ok: true, data: resp.data })
  } catch (error) {
    return res.json(error)
  }
}

const timeOffRequestEmployee = async (req, res = response) => {
  const PersonnelNumber = req.query.PersonnelNumber;
  const token = req.headers['authorization'];
  try {
    const resp = await timeOffRequestByEmployee(PersonnelNumber, token)
    res.json({ ok: true, data: resp.data })
  } catch (error) {
    return res.json(error)
  }
}

const getTypeLeave = async (req, res = response) => {
  const PersonnelNumber = req.query.PersonnelNumber;
  const token = req.headers['authorization'];
  try {
    const resp = await getTypeLeaveByEmployee(PersonnelNumber, token)
    res.json({ ok: true, data: resp.data })
  } catch (error) {
    return res.json(error)
  }
}

const requestTimeOff = async (req, res = response) => {
  const LeaveDate = dayjs(new Date()).format("YYYY-MM-DD");
  const datos = { ...req.body, LeaveDate };
  const token = req.headers['authorization'];
  try {
    const resp = await requestTimeOffByEmployee(datos, token)
    res.json(resp)
  } catch (error) {
    return res.json(error)
  }
}

const getPayStatementEarningLine = async(req, res = response) => {
  const PersonnelNumber = req.query.PersonnelNumber;
  const PayStatementNumber = req.query.PayStatementNumber;
  const token = req.headers['authorization'];
  try {
    const resp = await payStatementEarningLine(token, PersonnelNumber, PayStatementNumber)
    res.json({ ok: true, data: resp.data })
  } catch (error) {
    return res.json(error)
  }
}

const getAccumulationEarnings = async(req, res = response) => {
  const PayStatementNumber = req.query.PayStatementNumber;
  const token = req.headers['authorization'];
  try {
    const resp = await accumulationEarnings(PayStatementNumber, token)
    res.json({ ok: true, data: resp.data })
  } catch (error) {
    return res.json(error)
  } 
}

const getDeductionsByBenefit = async(req, res = response) => {
  const PayStatementNumber = req.query.PayStatementNumber;
  const token = req.headers['authorization'];
  try {
    const resp = await deductionsOfBenefitByEmployee(PayStatementNumber, token)
    res.json({ ok: true, data: resp })
  } catch (error) {
    return res.json(error)
  } 
}

const getDeductionsImpuestos = async(req, res = response) => {
  const PayStatementNumber = req.query.PayStatementNumber;
  const token = req.headers['authorization'];
  try {
    const resp = await deductionsImpuestos(PayStatementNumber, token)
    res.json({ ok: true, data: resp.data })
  } catch (error) {
    return res.json(error)
  } 
}


module.exports = {
  getAllPayments,
  getLeaveAndAbsence,
  approvedTimeOff,
  timeOffRequestEmployee,
  getTypeLeave,
  requestTimeOff,
  getPayStatementEarningLine,
  getAccumulationEarnings,
  getDeductionsByBenefit,
  getDeductionsImpuestos
}