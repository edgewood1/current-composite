const testFolder = '../my_blog/';
const fs = require('fs');
var showdown  = require('showdown')
// this returns a list of files from my_blog

function getFiles (dir, files_){
  files_ = files_ || [];
  var files = fs.readdirSync(dir);
  for (var i in files){
      var name = dir + '/' + files[i];
      if (fs.statSync(name).isDirectory()){
          getFiles(name, files_);
      } else {
          files_.push(name);
      }
  }

  return files_;
}
 
// this returns the contents of a particular file
// pass ing a particular file: markdown[3]

function getFileContents() {
  return new Promise( async (res, rej) => {
    const markdown = await getFiles(testFolder);
    const file = await fs.readFileSync(markdown[3],
      {encoding:'utf8', flag:'r'}); 
      var conv = new showdown.Converter({metadata: true});
      var html = conv.makeHtml(file);
      console.log(html)
      var metadata = conv.getMetadata(); // returns an object with the document metadata
    res(html)
  })
  
}
const x = getFileContents()
console.log(x)

exports.getFileContents = getFileContents;
exports.getFiles = getFiles

 // function parseFiles(markdown) {
//   return new Promise ((res, rej) => {
//     const files = markdown.map((e) => {
//       e.substring(10)
//     }).then((data) => {
//       res(data);
//     })

    
//   })
// }
// var showdown  = require('showdown'),
//     converter = new showdown.Converter(),
//     text      = '# hello, markdown!',
//     html      = converter.makeHtml(text);
var folder = testFolder  + 'css/animate.md'


