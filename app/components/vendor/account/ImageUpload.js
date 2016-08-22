var React = require('react');

var ImageUpload = React.createClass({
  getInitialState: function() {
    return {
      uploading: false,
      uploadProgress: 0,
      error: '',
    }
  },
  onUpdatePictures: function(e) {
    var that = this;
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

    var storageRef = firebase.storage().ref('vendor-images/' + user.uid + '/' + selectedFile.name);
    var uploadTask = storageRef.put(selectedFile);
    uploadTask.on('state_changed', function progress(snapshot) {
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      this.setState({
        uploading: true,
        uploadProgress: progress,
        error: ''
      });
    }.bind(this), function(error) {
      console.error("Error uploading file");
      console.error(error);
      this.setState({
        uploading: false,
        uploadProgress: 0,
        error: error
      });
    }.bind(this), function() {
      firebase.database().ref('vendors/' + user.uid + '/images').push({
        url: uploadTask.snapshot.downloadURL
      });
      this.setState({
        uploading: false,
        uploadProgress: 0,
        error: ''
      });
    }.bind(this));
  },  
  render: function() {
    return (
      <div className="image-upload">
        <label htmlFor="picture" className="file-upload full-width">
          {this.state.uploading ? 'Uploading: ' + this.state.uploadProgress.toFixed(0) + '% done' : 'Upload images'}
        </label>
        <input type="file" name="picture" id="picture" className="form-control hidden-file-upload" accept="image/*" onChange={this.onUpdatePictures} />
      </div>
    )
  }
});

module.exports = ImageUpload;