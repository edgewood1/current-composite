import * as _ from 'lodash';
function component() {
    var element = document.createElement('div');
    element.innerHTML = _.join(['Hello', 'webwspack'], ' ');
    return element;
}
document.body.appendChild(component());
//# sourceMappingURL=index.js.map