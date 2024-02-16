const{ Schema, model} = require('mongoose');

/*{
    resource,
        tenant_id,
        client_id,
        client_secret,
        grant_type
}*/

const useradminSchema = Schema({
    codigo: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
});

useradminSchema.method('toJSON', function(){
    const{ __v, ...object } = this.toObject();
    return object;
});                     


module.exports = model('UserAdmin', useradminSchema );