import layout from './components/layout';
import addHandlers from './handlers';
import '../css/styles.css';

document.querySelector('html').classList.add('scroll-smooth');
document.body.classList.add(
  'relative',
  'min-h-screen',
  'overflow-y-scroll',
  'flex',
  'flex-col',
  'font-sans',
  'bg-zinc-50',
  'selection:bg-pink-300'
);
document.body.insertAdjacentHTML('beforeend', layout);

addHandlers();

// TODO:
// [x] get location by name
// [x] get weather
// [x] display weather
// [] add error handlers
// [] convert metric/imperial units
// [] *ask current geo location
