var concurrently = require('concurrently');
var devServerCommand = 'node node.js --watch --open --node-resolve dist/index.html';
// if (passthroughArgs) {
//   devServerCommand = `${devServerCommand} ${passthroughArgs}`;
// }
concurrently([
    {
        command: 'tsc -w',
        name: 'typescript',
        prefixColor: 'blue',
    }, {
        command: devServerCommand,
        name: 'server',
        prefixColor: 'green',
    },
]);
//# sourceMappingURL=node2.js.map