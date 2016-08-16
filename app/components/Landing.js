var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;

var Landing = React.createClass({
  render: function() {
    return (
      <div>
        <nav className="navbar">
          <div className="navbar-header">
            <h1 className="navbar-brand"><Link to='/'>Streetfood Finder</Link></h1>
          </div>
        </nav>
        <div className="main-container landing">
          <div className="hero-wrapper">
            <img src="./img/van2.jpg" className="hero-image" />
            <div className="hero-overlay">
              <p className="strapline">
                Streetfood Finder is the best way to discover great
                food in your area 
              </p>
              <Link to='/signup'>
                <button type="button" className="btn btn-success">Get Started</button>
              </Link>
              <p className="login">Already have an account? <Link to='/login'>Log in</Link></p>
            </div>
          </div>
        </div>
      </div>
    )
  }
});

module.exports = Landing;