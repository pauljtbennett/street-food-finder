var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
var ImageUpload = require('./account/ImageUpload');

var Account = React.createClass({
  mixins: [ReactFireMixin],
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
        var vendorId = user.uid;
        var vendorRef = firebase.database().ref('vendors/' + vendorId);
        var imagesRef = firebase.database().ref('vendors/' + vendorId + '/images');
        this.bindAsArray(imagesRef, 'images');

        // Text-based properties that we'll be updating in
        // the form don't need to be live
        vendorRef.once('value').then(function(snapshot) {
          var vendor = snapshot.val();
          this.setState({
            name: vendor.name,
            strapline: vendor.strapline,
            description: vendor.description,
          })
        }.bind(this));
      }
    }.bind(this));
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
            <h3 className="plain">Images</h3>
            <ul className="image-list">
              {this.state.images.map(function(image) {
                return <li key={image['.key']} className="image-list-item">
                    <img src={image.url} />
                  </li>
              })}
            </ul>
            <ImageUpload />
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