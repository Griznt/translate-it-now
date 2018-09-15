import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './web/components/app/app';
import registerServiceWorker from './web/registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
