var React = require('react');
var Navigation = require('./Navigation');

var Main = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },  
  getInitialState: function() {
    return {
      user: {}
    }
  },
  componentWillMount: function() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user === null) {
        this.context.router.push('/');
      }
    }.bind(this));
  },
  render: function() {
    return (
      <div>
        <Navigation />
        <div className="main-container" id="main-container">
          {this.props.children}
        </div>
      </div>
    )
  }
});

module.exports = Main;