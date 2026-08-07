import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

import './style.css';

import { Products } from './components/Products.js';
import { Navbar } from './components/Navbar.js';
import { Hero } from './components/Hero.js';

document.querySelector('#app').innerHTML = `

${Navbar()}

${Hero()}

${Products()}
`;