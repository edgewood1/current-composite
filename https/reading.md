


command: 

openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem

//  may have to create a new one with a 'common name - fullyqualified host name'

// have 2 ports to listen on at same time
// these conflict with each other
// http 80
// 443 - https 
// localhost - doesn't matter. 
// facing world - pick these 


// kill port
kill $(lsof -ti:3000,3001,5000,5001)

