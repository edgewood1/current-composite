const concurrently = require('concurrently');
const arg = require('arg');

const args = arg({
  '--delay': Number,
  '--target': String,
  '--debug': Boolean,
}, {
  permissive: true,
});

const passthroughArgs = Object.keys(args).reduce((result, key) => {
  if (key !== '_') {
    result.push(`${key} ${args[key]}`);
  }
  return result;
}, []).join(' ');

// let devServerCommand = 'web-dev-server --watch --open --node-resolve index.html --esbuild-target auto';
let devServerCommand = "webpack --mode development --config webpack.config.js --watch";
if (passthroughArgs) {
  devServerCommand = `${devServerCommand} ${passthroughArgs}`;
}

concurrently([
  // {
  //   command: 'tsc -w',
  //   name: 'typescript',
  //   prefixColor: 'blue',
  // }, 

  // open a new command here. 
  {
    command: 'node node.js',
    prefixColor: 'green',
    name: 'node'
  },
  {
    command: devServerCommand,
    name: 'dev-server',
    prefixColor: 'green',
  },
]);