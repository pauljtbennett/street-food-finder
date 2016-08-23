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

    firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
      firebase.database().ref('users/' + user.uid).update({
        displayName: user.displayName,
        photoURL: user.photoURL,
      });
    }.bind(this)).catch(function(error) {
      this.setState({
        errorCode: error.code,
        errorMessage: error.message
      });
    }.bind(this));
  },
  handleFacebookLogin: function(e) {
    e.preventDefault();
    this.setState({
      errorCode: '',
      errorMessage: ''
    });
    var provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('email');
    firebase.auth().signInWithPopup(provider).then(function(result) {
      var user = firebase.auth().currentUser;
      user.updateEmail(result.user.providerData[0].email);
      firebase.database().ref('users/' + user.uid).set({
        displayName: user.displayName,
        photoURL: user.photoURL,
      });
    }.bind(this)).catch(function(error) {
      this.setState({
        errorCode: error.code,
        errorMessage: error.message
      });
    }.bind(this));
  },
  handleGoogleLogin: function(e) {
    e.preventDefault();
    this.setState({
      errorCode: '',
      errorMessage: ''
    });
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('email');
    firebase.auth().signInWithPopup(provider).then(function(result) {
      var user = firebase.auth().currentUser;
      user.updateEmail(result.user.providerData[0].email);
      firebase.database().ref('users/' + user.uid).set({
        displayName: user.displayName,
        photoURL: user.photoURL,
      });
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
        onFacebookLogin={this.handleFacebookLogin}
        onGoogleLogin={this.handleGoogleLogin}
        email={this.state.email}
        password={this.state.password}
        errorCode={this.state.errorCode}
        errorMessage={this.state.errorMessage} 
        />
    )
  }
});

module.exports = LoginContainer;