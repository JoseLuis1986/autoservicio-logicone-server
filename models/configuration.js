const{ Schema, model} = require('mongoose');

/*{
    resource,
        tenant_id,
        client_id,
        client_secret,
        grant_type
}*/

const configurationSchema = Schema({

    resource: {
        type: String,
        required: true
    },
    tenant_id: {
        type: String,
        required: true,
        unique: true
    },
    client_id: {
        type: String,
        required: true
    },
    client_secret: {
        type: String,
        required: true
    },
    grant_type: {
        type: String,
        required: true
    }
});

configurationSchema.method('toJSON', function(){
    const{ __v, ...object } = this.toObject();
    return object;
});                     


module.exports = model('Configuration', configurationSchema );