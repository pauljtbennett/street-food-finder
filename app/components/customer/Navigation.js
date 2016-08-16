var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;

var Navigation = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },
  getInitialState: function() {
    return {
      navOpen: false
    }
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
    e.preventDefault();
    var navOpen = !this.state.navOpen;
    this.setState({
      navOpen: navOpen
    });
    var nav = document.getElementById('navbar-collapse');
    if (navOpen) {
      nav.classList.add('open');
    } else {
      nav.classList.remove('open');
    }
  },
  render: function() {
    return (
      <nav className="navbar">
        <div className="navbar-header">
          <button type="button" className="nav-toggle" onClick={this.toggleNavigation}>
            <i className="fa fa-bars"></i>
          </button>
          <h1 className="navbar-brand"><Link to='/'>Streetfood Finder</Link></h1>
        </div>
        <div className="navbar-collapse" id="navbar-collapse">
          <ul className="nav navbar-nav">
            <li><Link to='/customer/nearby'><i className="fa fa-map-marker fa-fw"></i>Nearby</Link></li>
            <li><Link to='/customer/map'><i className="fa fa-map fa-fw"></i>Map</Link></li>
            <li><Link to='/customer/search'><i className="fa fa-search fa-fw"></i>Search</Link></li>
            <li><Link to='/customer/account'><i className="fa fa-user fa-fw"></i>Account</Link></li>
            <li><a onClick={this.handleLogout}><i className="fa fa-sign-out fa-fw"></i>Logout</a></li>
          </ul>
          <ul className="nav navbar-nav">
            <li><Link to='/vendor/account'><i className="fa fa-truck fa-fw"></i>Switch to vendor</Link></li>
          </ul>
        </div>
      </nav>
    )
  }
});

module.exports = Navigation;