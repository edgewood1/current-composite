
// dependcies

var crypto = require('crypto');
var config = require('./config');

// helpers for various tasks

var helpers = {};


// create a SHA256 hash

helpers.hash = (string) => {
  if (typeof(string) === 'string' && string.length > 0) {
    var hash = crypto.createHmac('sha256',config.hashingSecret).update(string).digest('hex');
    return hash;
  } else {
    return false;
  }
}

// parse a json string to an object in all cases without throwing. 
// 444 444 4116
helpers.parseJsonToObject = (string) => {
  try {
    var obj = JSON.parse(string);
    return obj;
  } catch(e) {
    // console.log('parseJsonerror', e)
    return {};
  }
}


module.exports = helpers;