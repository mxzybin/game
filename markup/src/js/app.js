import initGame from './components/game';
import ready, { HTML } from './utils';

ready(() => {
  HTML.classList.add('is-loaded');
  initGame();
});
