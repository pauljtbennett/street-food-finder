var React = require('react');
var Login = require('../components/Login');

var LoginContainer = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },
  getInitialState: function() {
    return {
      email: '',
      password: '',
      errorCode: '',
      errorMessage: ''
    }
  },
  componentWillMount: function() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        var user = firebase.auth().currentUser;
        firebase.database().ref('vendors/' + user.uid).once('value').then(function(snapshot) {
          if (snapshot.val() === null) {
            this.context.router.push('/customer/nearby');
          } else {
            this.context.router.push('/vendor/profile');
          }
        }.bind(this));
      }
    }.bind(this));
  },
  handleUpdateEmail: function(e) {
    this.setState({
      email: e.target.value
    });
  },
  handleUpdatePassword: function(e) {
    this.setState({
      password: e.target.value
    });
  },
  handleSubmitUser: function(e) {
    e.preventDefault();
    var email = this.state.email;
    var password = this.state.password;
    this.setState({
      errorCode: '',
      errorMessage: ''
    });

    firebase.auth().signInWithEmailAndPassword(email, password).then(function(data) {
      // After login attempt to get user's vendor profile,
      // if none exists treat them as a customer, otherwise
      // redirect to vendor profile
      var user = firebase.auth().currentUser;
      firebase.database().ref('vendors/' + user.uid).once('value').then(function(snapshot) {
        if (snapshot.val() === null) {
          this.context.router.push('/customer/nearby');
        } else {
          this.context.router.push('/vendor/profile');
        }
      }.bind(this));
    }.bind(this)).catch(function(error) {
      this.setState({
        errorCode: error.code,
        errorMessage: error.message
      });
    }.bind(this));
  },
  render: function() {
    return (
      <Login
        onUpdateEmail={this.handleUpdateEmail}
        onUpdatePassword={this.handleUpdatePassword}
        onSubmitUser={this.handleSubmitUser}
        email={this.state.email}
        password={this.state.password}
        errorCode={this.state.errorCode}
        errorMessage={this.state.errorMessage} 
        />
    )
  }
});

module.exports = LoginContainer;