
// dependencies

// const { delete } = require('./data');
var _data = require('./data');
const { hash } = require('./helpers');
var helpers = require('./helpers');

// router
// data recieved  everything we've parsed above will be in this object
// callback - a function to call - that returns status code and payload obj
// this function is the 2nd parameter of chosenHandler()
var handlers = {
  sample: (data) => {
    // data will be al the details about the request
    // into prewritten function, we pass 400 + object, which we'll call the payload string. 
    // call back an http status code  and payload object
    // callback in the chosenHandlers call. 
    // this just returns
    console.log('success--------', data)
    return [400, {name: 'sample handler'}]
    // callback(400, {'name': 'sample handler'})
    // this function 

  },
  notFound: (data) => {
    // callback(404);
    return [404, {message: 'not found'}]
  }, 
  // used to see if your app is online
  ping: (data, callback) => {
    return [200,{message: 'ping'}]
  },
 users: async (data) => {
  // console.log('incoming data 1 ------', data)
  var acceptableMethods = ['post', 'get', 'put', 'delete'];
  if (acceptableMethods.indexOf(data.method) > -1) {
    return await handlers._users[data.method](data);
  } else {
    // what's beeing returned to the user: 
    return [405, {message: 'nope'}]
  }
}
}

// constainer for users submethods
// required data: firstname, lastname, phone, password, tosAgreement, no optional data
handlers._users = {};

handlers._users.post = async (data) => {
  let { firstName, lastName, phone, password, tosAgreement } = data.payload
  firstName = typeof(firstName) == 'string' && firstName.trim().length > 0 ? firstName.trim() : false;
  lastName = typeof(lastName) == 'string' && lastName.trim().length > 0 ? lastName.trim() : false;
  phone = typeof(phone) == 'string' && phone.trim().length === 10 ? phone.trim() : false;
  password = typeof(password) == 'string' && password.trim().length > 0 ? password.trim() : false;
  tosAgreement = typeof(tosAgreement) == 'boolean' && tosAgreement  === true ? true : false;
  
  if (!(firstName && lastName && phone && password && tosAgreement)) {
    return [400, {'Error': 'Missing required fields'}]
  } 
  // else {
  const isFilePresent  =  await _data.read('users', phone)
  // if file doesn't exist then hash password and create file
  if (!(isFilePresent instanceof Error)) return [400, {'Error': 'A user with that phone number already exists'}]
    
  var hashedPassword = helpers.hash(password);
  if (!hashedPassword) return [500, {'Error' : 'Could not hash the user\'s password'}]; 
  // store user
  var userObject = { firstName, lastName, phone, hashedPassword, tosAgreement };
  // always return what the inner return returns
  return await _data.create('users', phone, userObject)
    .catch((err) => { 
      console.log(err);
      return [500, {'Error': 'Could not create the new user'}]
    })
    .then(()=> {
      return[200, {}]
    })
      
      
    // }   
  }
    // make sure user doesn't already exist - read for users data
    // try {      
    //   await _data.read('users', phone)
    //   return [400, {'Error': 'A user with that phone number already exists'}]
    // } catch(err) {
    //     // hash password
    //     var hashedPassword = helpers.hash(password);
    //     console.log(hashedPassword)
    //     // create user object
    //     if (hashedPassword) {
    //       // store user
    //       var userObject = { firstName, lastName, phone, hashedPassword, tosAgreement };
    //       try{
    //         await _data.create('users', phone, userObject);
    //         return[200, {}]
    //       } catch(err) {
    //         console.log(err);
    //         return [500, {'Error': 'Could not create the new user'}]
    //       }
    //       // if has fails
    //     } else {
    //       return [500, {'Error' : 'Could not hash the user\'s password'}];
    //     }
    // }
  // }
    
        

  //   _data.read('users', phone, (err, data) => {
  //     if (err) {
  //       // hash password
  //       var hashedPassword = helpers.hash(password);
  //       // create user object
  //       if (hashedPassword) {
  //         // store user
  //         var userObject = { firstName, lastName, phone, hashedPassword, tosAgreement };

  //         _data.create('users', phone, userObject, (err) => {
  //           if (!err) {
  //             callback(200)
  //           } else {
  //             console.log(err);
  //             callback(500, {'Error': 'Could not create the new user'})
  //           }
  //         });
  //       } else {
  //         callback(500, {'Error' : 'Could not has the user\'s password'})
  //       }
  //     } else {
  //       callback(400, {'Error': 'A user with that phone number already exists'})
  //     }
    // })



handlers._users.get = async (data) => {
  console.log(data)
  var { phone } = data.queryStringObj;
  console.log(phone)
  const isPhoneValid = typeof(phone) === 'string' && phone.length === 10;

  if (!isPhoneValid) return [404, {message: 'phone not valid'}]
  const response = await _data.read('users', phone);
  if ((response) instanceof Error) return [400, {'Error': 'File Doesnt Exist}'}];
    // remove hashed password 
    console.log('why')
    delete response.hashedPassword;
    data = JSON.parse(response);
    return [200, data]
}

// Required data: phone
// Optional data: firstname, lastword, password (at least one specified);
// only let an authenticated user update their own object - don't let them update anyone elses
// generally, we can throw an error object, which must be caught
// or return an error object, which must be analyzed. 
handlers._users.put = async (data) => {
  var { phone, firstName, lastName, password } = data.payload;
  const isPhoneValid = typeof(phone) === 'string' && phone.length === 10;
  // check optional fields
  firstName = typeof(firstName) == 'string' && firstName.trim().length > 0 ? firstName.trim() : false;
  lastName = typeof(lastName) == 'string' && lastName.trim().length > 0 ? lastName.trim() : false;
  password = typeof(password) == 'string' && password.trim().length > 0 ? password.trim() : false;
  if (!phone) return [400, {'Error': 'Missing required Field'}]
  if (!(firstName || lastName || password)) return [400, {'Error': 'Missing fields to update'}];
  return await _data.read('users', phone).catch(e => [400, {'Error': 'user does not exist'}]).then(userData => {
    console.log('read stufy - ', userData)
    userData = JSON.parse(userData);
    userData.firstName = firstName ? firstName : userData.firstName;
    userData.lastName = lastName ? lastName : userData.lastName;
    userData.hashedPassword = password ? helpers.hash(password) : userData.hashedPassword;
    console.log(userData);
    return _data.update('users', phone, userData)
    .then(user => 
      {console.log('updated ! ', user)
      return [200, {}] 
    })
    .catch(e => { return [500, {'Error': 'couldnt update'}]})
  })
  
}

handlers._users.delete = (data, callback) => {

}


module.exports = handlers;