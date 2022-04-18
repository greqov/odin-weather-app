import header from './header';
import main from './main';
import footer from './footer';

function layout() {
  return `
    ${header}
    ${main}
    ${footer}
  `;
}

export default layout();
