var React = require('react');
var Signup = require('../components/Signup');

var SignupContainer = React.createClass({
  mixins: [ReactFireMixin],
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
        this.context.router.push('/');
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

    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(data) {
      firebase.database().ref('users/' + data.uid).set({
        logins: 0
      }).then(function() {
        this.context.router.push('/customer/account');  
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
      <Signup
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

module.exports = SignupContainer;