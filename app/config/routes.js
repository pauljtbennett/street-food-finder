var React = require('react');
var ReactRouter = require('react-router');

var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var hashHistory = ReactRouter.hashHistory;
var IndexRoute = ReactRouter.IndexRoute;

// Generic routes
var Home = require('../components/Home');
var Landing = require('../components/Landing');
var LoginContainer = require('../containers/LoginContainer');
var SignupContainer = require('../containers/SignupContainer');

// Customer-specific routes
var CustomerMain = require('../components/customer/Main');
var CustomerAccount = require('../components/customer/Account');
var NearbyContainer = require('../containers/NearbyContainer');

// Vendor-specific routes
var VendorMain = require('../components/vendor/Main');
var VendorProfile = require('../components/vendor/Profile');
var VendorAccount = require('../components/vendor/Account');
var VendorMenu = require('../components/vendor/Menu');

var routes = (
  <Router history={hashHistory}>
    <Route path='/' component={Home}>
      <IndexRoute component={Landing} />
      <Route path='login' header='Log In' component={LoginContainer} />
      <Route path='signup' header='Sign Up' component={SignupContainer} />
      <Route path='customer' component={CustomerMain}>
        <IndexRoute />
        <Route path='nearby' header='Nearby' component={NearbyContainer} />
        <Route path='account' header='Account' component={CustomerAccount} />
        <Route path='map' header='Map' />
        <Route path='search' header='Search' />
        <Route path='vendor/:id' header='Profile' component={VendorProfile} />
      </Route>
      <Route path='vendor' component={VendorMain}>
        <IndexRoute />
        <Route path='profile' header='Profile' component={VendorProfile} />
        <Route path='account' header='Account' component={VendorAccount} />
        <Route path='menu' header='Menu' component={VendorMenu} />
      </Route>
    </Route>
  </Router>
);

module.exports = routes;