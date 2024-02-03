"use strict";

const _ = require('lodash');
const secretKey = 'app.movitronic';
var CryptoJS = require("crypto-js");

module.exports = {
    getStorageData:function(key){
    let user = _.isEmpty(localStorage.getItem(key))? {} : (localStorage.getItem(key))
    // Decrypt
    if(user.length){
        var bytes  = CryptoJS.AES.decrypt(user, secretKey);
    var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return _.isEmpty(decryptedData) ? {} : decryptedData;

    }
    },
    
    setStorageData:function(key,value){
    // Encrypt
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(value), secretKey).toString();
    localStorage.setItem(key, ciphertext);

    },
    formData:function(object){
        console.log("formData");
    const formData = new FormData();
    Object.keys(object).forEach(key => formData.append(key, object[key]));
    return formData;
    },

    baseUrl:function()  {
        return 'https://api.movitronic.com/api';
    },
    overlay(is_show = false)
    {
        if( is_show == true ){
            document.getElementById("overlay").style.display = "block";
        } else {
            document.getElementById("overlay").style.display = "none";
        }
    },

    getPermissions:function(module_name = '', module_array = [], user_type = ''){
       
        if(user_type === 'admin'){
            return module_array.includes(module_name);
        }
        else if( user_type === 'operator'){
            return true;
        }
        else if(user_type === 'superadmin'){
            return true;
        }
    },

    loadScript(src){
        var tag = document.createElement('script');
        tag.async = false;
        tag.src = src;
        var body = document.getElementsByTagName('body')[0];
        body.appendChild(tag);
    },
}