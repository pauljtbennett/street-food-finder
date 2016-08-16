var React = require('react');
var ReactDOM = require('react-dom');
var ReactFire = require('reactfire');
var routes = require('./config/routes');
var firebaseConfig = require('./config/firebase');

firebase.initializeApp(firebaseConfig);
ReactDOM.render(routes, document.getElementById('app'));