import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

firebase.initializeApp({
    apiKey: "AIzaSyBGRQZFJbpzYTH6BZFiN6362rx17h9EfrQ",
    authDomain: "vantexgram.firebaseapp.com",
    databaseURL: "https://vantexgram.firebaseio.com",
    projectId: "vantexgram",
    storageBucket: "vantexgram.appspot.com",
    messagingSenderId: "687743193747"
});

ReactDOM.render(
    <App />,
     document.getElementById('root'));
registerServiceWorker();
