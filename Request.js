const request = require('request');

const callApi = async(extURL, callback) => {
    request(extURL, { json: true}, (err, res, body) => {
        if (err) {
            return callback(err);
        } 
        return callback(body);
    })
}

module.exports = callApi;