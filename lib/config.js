//* environmentToExport is used by package.json
// it's based on environments[curentEnvironment]
// environments - environemnt object that has 2 properties
// - staging = { port, envName }
// - production = { port, envName }
// this file is imported by index.js server, which uses the defined port
//

// create / export config variables

 
// general container for all environments: 

const environments = {};

// staging will be the default

environments.staging = {
  httpPort: 3000,
  httpsPort: 3001,
  envName : 'staging',
  hashingSecret : 'thisIsASecret'
};

environments.production = {
  httpPort: 5000,
  httpsPort: 5001,
  envName: 'production',
  hashingSecret : 'thisIsAlsoASecret'
};

// what was passed? NODE_ENV = staging OR production OR neither

const currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// if value passed exists in our enviornemnts object, then assign that property to export.  

// check that the current env is one of the environments above, if not default to staging.  

const environmentToExport = typeof(environments[currentEnvironment]) === 'object' ? environments[currentEnvironment] : environments.staging;

module.exports = environmentToExport;