var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;

var Account = React.createClass({
  getInitialState: function() {
    return {
      name: '',
      email: '',
      picture: '',
      providerId: '',
      uploading: false,
      uploadProgress: 0
    };
  },
  componentWillMount: function() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        this.setState({
          name: user.displayName,
          email: user.email,
          picture: user.photoURL,
          providerId: user.providerData[0].providerId,
        });
      }
    }.bind(this));
  },
  onUpdatePicture: function(e) {
    var user = firebase.auth().currentUser;
    var selectedFile = document.getElementById('picture').files[0];
    
    // Do some basic file validation
    if (selectedFile.size > 1024 * 1024 * 5) {
      console.error("File size too large");
      return;
    }
    if (['image/jpg', 'image/jpeg', 'image/png'].indexOf(selectedFile.type) === -1) {
      console.error("File type not supported");
      return;
    }

    var storageRef = firebase.storage().ref('profile-images/' + user.uid + '/' + selectedFile.name);
    var uploadTask = storageRef.put(selectedFile);
    uploadTask.on('state_changed', function progress(snapshot) {
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      this.setState({
        uploading: true,
        uploadProgress: progress
      });
    }.bind(this), function(error) {
      console.error("Error uploading file");
      console.error(error);
      this.setState({
        uploading: false,
        uploadProgress: 0
      });
    }.bind(this), function() {
      var downloadURL = uploadTask.snapshot.downloadURL;
      user.updateProfile({
        photoURL: downloadURL
      }).then(function() {
        this.setState({
          picture: downloadURL,
          uploading: false,
          uploadProgress: 0
        });
      }.bind(this), function(error) {
        console.error("Error updating profile");
        console.error(error);
        this.setState({
          uploading: false,
          uploadProgress: 0
        });
      }.bind(this));
    }.bind(this));
  },
  onUpdateName: function(e) {
    this.setState({
      name: e.target.value
    });
  },
  onUpdateEmail: function(e) {
    this.setState({
      email: e.target.value
    });
  },
  onUpdatePassword: function(e) {
    this.setState({
      password: e.target.value
    });
  },
  handleSubmitProfile: function(e) {
    e.preventDefault();
    var user = firebase.auth().currentUser;
    user.updateProfile({
      displayName: this.state.name,
      email: this.state.email,
      password: this.state.password,
    }).then(function() {
      console.log("Profile updated");
    }, function(error) {
      console.error("Error updating profile");
      console.error(error);
    })
  },
  render: function() {
    return (
      <div className="inner-container">
        {this.state.providerId === 'password' ?
          <form onSubmit={this.handleSubmitProfile}>
            <div className="form-group">
              <div className="profile-picture-uploader">
                <label htmlFor="picture">
                  <img src={this.state.picture} className="profile-pic" />
                </label>
                <div className="overlay">
                  <span className="upload-progress">{this.state.uploading ? this.state.uploadProgress.toFixed(0) + '%' : ''}</span>
                </div>
                <input type="file" name="picture" id="picture" className="form-control hidden-file-upload" accept="image/*" onChange={this.onUpdatePicture} />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="fname">Your Name</label>
              <input type="text" name="fname" id="fname" className="form-control" value={this.state.name} onChange={this.onUpdateName} />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" name="email" id="email" className="form-control" value={this.state.email} onChange={this.onUpdateEmail} />
            </div>
            <div className="form-group">
              <label htmlFor="email">Password</label>
              <input type="password" name="password" id="password" className="form-control" onChange={this.onUpdatePassword} />
            </div>
            <button type="submit" className="btn btn-success">Save Profile</button>
          </form> :
          <p>Your account information is managed by <strong>{this.state.providerId}</strong></p>
        }
      </div>
    )
  }
});

module.exports = Account;