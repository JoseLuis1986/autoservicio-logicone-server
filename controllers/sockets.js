const User = require('../models/user');
const Message = require('../models/message');
const Note = require('../models/notes');
const res = require('express/lib/response');
const { cloudinary } = require('../utils/cloudinary');



const userConnected = async( uid ) => {

    try {
        const user = await User.findById( uid );
        user.online = true;
        await user.save();
    
        return user;
        
    } catch (err) {
        console.log(err)
    }
}

const userDisconnect = async( uid ) => {

    try {
        const userDisc = await User.findById( uid );
        userDisc.online = false;
        await userDisc.save();
    
        return userDisc;
        
    } catch (err) {
        console.log(err)
    }
    
}


const getUsers = async() => {

    try {
        const users = await User
        .find()
        .sort('-online');
    
        return users;
        
    } catch (err) {
        console.log(err)
    }
}

const saveMessage = async( payload ) => {
    console.log("save message", payload);
    try {
        
        const msg = new Message( payload );
        await msg.save();
        
        return msg;

    } catch (error) {
        console.log(error);
        return false;
    }
}

const saveUrl = async(file) => {
    try {
        const uploadResp = await cloudinary.uploader.upload( file, {
            upload_preset: 'notes_sb'
        });
        return uploadResp;
        // res.json({ msg: 'File uploaded succesfuly' });

    } catch (err) {
        console.error(err);
        // res.status(500).json({ err: 'Somenthing went wrong'});
        return false
    }

}


const saveNote = async( payload ) => {
console.log(payload);
    try {
        const note = new Note( payload );
        const saved = await note.save();
        
        console.log(saved);
        return saved;
        

    } catch (error) {
        console.log(error);
        return false;
    }
}


const getNotes = async() => {
    try {
        const notes = await Note.find();
        return notes;
        
    } catch (err) {
        console.log(err)
    }
}


module.exports = {
    userConnected,
    userDisconnect,
    getUsers,
    saveMessage,
    saveNote,
    saveUrl,
    getNotes
}