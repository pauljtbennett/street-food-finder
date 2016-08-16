var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;

var Account = React.createClass({
  getInitialState: function() {
    return {
      name: '',
      strapline: '',
      description: '',
      images: []
    };
  },
  componentWillMount: function() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        firebase.database().ref('vendors/' + user.uid).once('value').then(function(snapshot) {
          var vendor = snapshot.val();
          if (vendor !== null) {
            var images = [];
            if (vendor.images) {
              images = Object.keys(vendor.images).map(function(key) {
                return {
                  id: key,
                  url: vendor.images[key].url 
                }
              });
            }

            this.setState({
              name: vendor.name,
              strapline: vendor.strapline,
              description: vendor.description,
              images: images,
            });
          }
        }.bind(this));
      }
    }.bind(this));
  },
  onUpdatePictures: function(e) {
    var that = this;
    var user = firebase.auth().currentUser;
    var selectedFiles = document.getElementById('picture').files;

    for (var i = 0, numFiles = selectedFiles.length; i < numFiles; i++) {
      var selectedFile = selectedFiles[i];
      var storageRef = firebase.storage().ref('vendor-images/' + user.uid + '/' + selectedFile.name);
      var uploadTask = storageRef.put(selectedFile);
      uploadTask.on('state_changed', function progress(snapshot) {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      }, function(error) {
        console.error("Error uploading file");
        console.error(error);
      }, function() {
        firebase.database().ref('vendors/' + user.uid + '/images').push({
          url: uploadTask.snapshot.downloadURL
        });
      });
    };
  },
  onUpdateName: function(e) {
    this.setState({
      name: e.target.value
    });
  },
  onUpdateStrapline: function(e) {
    this.setState({
      strapline: e.target.value
    });
  },
  onUpdateDescription: function(e) {
    this.setState({
      description: e.target.value
    });
  },
  handleSubmitProfile: function(e) {
    e.preventDefault();
    var user = firebase.auth().currentUser;
    firebase.database().ref('vendors/' + user.uid).update({
      name: this.state.name,
      strapline: this.state.strapline,
      description: this.state.description
    });
  },
  render: function() {
    return (
      <div className="inner-container vendor-account">
        <h2 className="plain">Vendor Account</h2>
        <p>Welcome to your vendor account, set up your profile here.</p>

        <hr />

        <form onSubmit={this.handleSubmitProfile}>
          <div className="form-group">
            <label>Images</label>
            <ul className="image-list">
            {this.state.images.map(function(image) {
              return <li key={image.id} className="image-list-item">
                  <img src={image.url} />
                </li>
            })}
            </ul>
            <label htmlFor="picture" className="file-upload full-width">Upload images</label>
            <input type="file" name="picture" id="picture" multiple="multiple" className="form-control hidden-file-upload" accept="image/*" onChange={this.onUpdatePictures} />
          </div>
          <div className="form-group">
            <label htmlFor="fname">Vendor Name</label>
            <input type="text" name="fname" id="fname" className="form-control" value={this.state.name} onChange={this.onUpdateName} />
          </div>
          <div className="form-group">
            <label htmlFor="strapline">Strapline</label>
            <input type="text" name="strapline" id="strapline" className="form-control" value={this.state.strapline} onChange={this.onUpdateStrapline} />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea name="description" id="description" className="form-control" value={this.state.description} onChange={this.onUpdateDescription} />
          </div>
          <button type="submit" className="btn btn-success full-width">Save</button>
        </form>
      </div>
    )
  }
});

module.exports = Account;