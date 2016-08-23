var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;

var Navigation = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },
  getInitialState: function() {
    return {
      navOpen: false,
      user: {},
    }
  },
  componentWillMount: function() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user !== null) {
        this.setState({
          user: user
        });
      }
    }.bind(this));
  },
  handleLogout: function(e) {
    e.preventDefault();
    firebase.auth().signOut().then(function() {
      this.context.router.push('/');
    }.bind(this), function(error) {
      console.error(error);
    });
  },
  toggleNavigation: function(e) {
    if (e) e.preventDefault();
    var navOpen = !this.state.navOpen;
    this.setState({
      navOpen: navOpen
    });
    var nav = document.getElementById('navbar-collapse');
    var body = document.getElementById('app');
    if (navOpen) {
      nav.classList.add('open');
      body.classList.add('open');
    } else {
      nav.classList.remove('open');
      body.classList.remove('open');
    }
  },
  handleLinkClick: function(e) {
    this.toggleNavigation();
  },
  render: function() {
    return (
      <nav className="navbar">
        <div className="navbar-header">
          <button type="button" className="nav-toggle" onClick={this.toggleNavigation}>
            <i className="fa fa-bars"></i>
          </button>
          <h1 className="navbar-brand"><Link to='/'>Street Food Finder</Link></h1>
        </div>
        <div className="navbar-collapse" id="navbar-collapse">
          <ul className="nav navbar-nav">
            <li className="profile-bar">
              <img src={this.state.user.photoURL} className="profile-pic" />
              <strong>{this.state.user.displayName}</strong>
            </li>
          </ul>
          <ul className="nav navbar-nav">
            <li><Link to='/customer/nearby' activeClassName='active' onClick={this.handleLinkClick}><i className="fa fa-map-marker fa-fw"></i>Nearby</Link></li>
            <li><Link to='/customer/map' activeClassName='active' onClick={this.handleLinkClick}><i className="fa fa-map fa-fw"></i>Map</Link></li>
            <li><Link to='/customer/search' activeClassName='active' onClick={this.handleLinkClick}><i className="fa fa-search fa-fw"></i>Search</Link></li>
            <li><Link to='/customer/account' activeClassName='active' onClick={this.handleLinkClick}><i className="fa fa-user fa-fw"></i>Account</Link></li>
            <li><a onClick={this.handleLogout}><i className="fa fa-sign-out fa-fw"></i>Logout</a></li>
          </ul>
          <ul className="nav navbar-nav">
            <li><Link to='/vendor/account' activeClassName='active' onClick={this.handleLinkClick}><i className="fa fa-truck fa-fw"></i>Switch to vendor</Link></li>
          </ul>
        </div>
      </nav>
    )
  }
});

module.exports = Navigation;