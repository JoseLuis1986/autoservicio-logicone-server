const{ Schema, model} = require('mongoose');


const NoteSchema = Schema({

    from: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },  
    department: {
        type: String,
        ref: 'User',
        required: true
    },  
    title: {
        type: String,
        ref: 'User',
        required: true
    },  
    body: {
        type: String,
        ref: 'User',
        required: true
    }, 
    level: {
        type: String,
        ref: 'User',
        required: true
    },   
    url: {
        type: String,
        required: false
    }
    
}, {
    timestamps: true
});

NoteSchema.method('toJSON', function(){
    const{ __v, ...object } = this.toObject();
    return object;
});                     

module.exports = model('Note', NoteSchema );