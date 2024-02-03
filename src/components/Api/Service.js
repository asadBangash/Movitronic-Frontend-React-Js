const axios = require('axios').default;
const Helper = require('../Helper');
const _ = require('lodash');
let userObj = Helper.getStorageData('SESSION');
if(!_.isEmpty(userObj)){
    let token = userObj.access_token;
    axios.defaults.headers.common = {'Authorization': `Bearer ${token}`}
}

module.exports = {

    apiRequest: function(method, url, param) {
        
        return new Promise((resolve, reject) => {
            
            axios({
                method: method,
                url: url,
                data: param,
                })
                .then((response) => response) 
                .then((res) => {
                    resolve(res);
                    })
                    //handle success
                .catch(function (response) {
                    //handle error
                    reject(response);
                });
        });
        }
}