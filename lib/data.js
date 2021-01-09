
// library for storing and editing data

// dependencies
const fs = require('fs');
const path = require('path');
const { promisify } = require('util')

const asyncOpen = promisify(fs.open);
const asyncRead = promisify(fs.readFile);
const asyncWriteFile = promisify(fs.writeFile);
const asyncClose = promisify(fs.close);
const asyncDelete = promisify(fs.unlink);
const asyncAppend = promisify(fs.appendFile);
// Convert callback based methods to  
// promise based methods 

// [1] (node:15512) [DEP0081] DeprecationWarning: Using fs.truncate with a file descriptor is deprecated. Please use fs.ftruncate with a file descriptor instead.
const asyncTrunct = promisify(fs.truncate) 
// container for module (to be exported)

let lib = {};

// base directory of the data folder
lib.baseDir = path.join(__dirname, '/../.data');
console.log(lib.baseDir)

// function for writing data to a file
lib.create = async (dir, file, data) => {
  const targetFile = `${lib.baseDir}/${dir}/${file}.json`
  try {
    const fileDescriptor = await asyncOpen(targetFile, 'wx'); 
    await asyncWriteFile(fileDescriptor, JSON.stringify(data)) 
    await asyncClose(fileDescriptor); 
    return 'success'
  } catch(err) {
    console.log(err)
    throw err; // what is this? 
    return err;
}
}

// read data from a file - no callback

lib.read = async (dir, file) => {
  console.log('hit')
  const targetFile = `${lib.baseDir}/${dir}/${file}.json`;
  try {
    // console.log('returning the results')
    const test = await asyncRead(targetFile, 'utf8');
    console.log('reading ... ', test)
    return test
  } catch(err) {
    // 
    console.log('file doesnt exist, so create one', err);
    // return err;
    throw new Error('file doesnt exist');
  }
}

lib.update = async(dir, file, data) => {
  const targetFile = `${lib.baseDir}/${dir}/${file}.json`;
  try {
    // open file for writing: r+ > open for writing but errors out if file doesn't exist - before file errors if already exists. 
    const fileDescriptor = await asyncOpen(targetFile, 'r+'); 
    // 
    const stringData = JSON.stringify(data);
    // turncate file
    const trunc = await asyncTrunct(fileDescriptor); 

    await asyncWriteFile(fileDescriptor, stringData);
    await asyncClose(fileDescriptor); 
    return 'success'
  
  } catch(err) {
    console.log(err)
    throw err; // what is this? 
    return err;
  }
}

lib.append = async(dir, file, data) => {
  const targetFile = `${lib.baseDir}/${dir}/${file}.json`;
  try {
    // open file for writing: r+ > open for writing but errors out if file doesn't exist - before file errors if already exists. 
    const fileDescriptor = await asyncOpen(targetFile, 'a+'); 
    // 
    const stringData = JSON.stringify(data);
    // turncate file
    // const trunc = await asyncTrunct(fileDescriptor); 

    await asyncAppend(fileDescriptor, stringData);
    await asyncClose(fileDescriptor); 
    return 'success'
  
  } catch(err) {
    console.log(err)
    throw err; // what is this? 
    return err;
  }
}

lib.delete = async(dir, file) => {
  const targetFile = `${lib.baseDir}/${dir}/${file}.json`;
  // unlink / remove file from file system
  try {
    await asyncDelete(targetFile);
  } catch(err) {
    console.log(err)
    return err;
  }
  
}


// export it

module.exports = lib;

  // open file for writing
  // fs.open(targetFile, 'wx', (err, fileDescriptor) => {
  //   if(!err && fileDescriptor) {
  //     // convert data to string
  //     let stringData = JSON.stringify(data);
  //     // write to file and close
  //     fs.writeFile(fileDescriptor, stringData, (err) => {
  //       if (!err) {
  //           fs.close(fileDescriptor, (err) => {
  //             if (!err) {
  //               // saying a false error
  //               callback(false);
  //             } else {
  //               callback('error closeing new file')
  //             } // if
  //           }) // fs.close
  //       } else {
  //         callback('error writing to new file')
  //       }
  //     }) // fs.writeFile
  //   } else {
  //     callback('could not create new file, it may already exist')
  //   } // fileDescriptor
  // }) // fs.open