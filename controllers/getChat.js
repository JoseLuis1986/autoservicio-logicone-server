const { response } = require('express');
const Message = require('../models/message');


const getChat = async( req, res = response ) => {

    const miId = req.uid;
    const msjsDe = req.params.de;

    console.log( msjsDe );

    try {
        const last30 = await Message.find({
            $or: [
                { from: miId, to: msjsDe},
                { from: msjsDe, to: miId}
            ]
        })
        .sort({ createdAt: 'asc'})
        .limit(30);
    
        res.json({
            ok: true,
            mensajes: last30
        })
        
    } catch (err) {
        console.log(err)
    }

}

module.exports = {
    getChat
}