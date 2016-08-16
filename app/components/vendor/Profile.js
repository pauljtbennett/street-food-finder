var React = require('react');
var ReactRouter = require('react-router');
var Tabs = require('./profile/Tabs');
var SessionButton = require('./session/SessionButton');

var Profile = React.createClass({
  mixins: [ReactFireMixin],
  vendorSessionRef: null,
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },
  getInitialState: function() {
    return {
      userIsOwner: false,
      user: null,
      vendor: {},
      images: []
    }
  },
  componentWillMount: function() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        this.setState({
          user: user,
          userIsOwner: (user.uid === this.props.params.id) || !this.props.params.id 
        });

        var vendorId = this.props.params.id || user.uid;
        var vendorRef = firebase.database().ref('vendors/' + vendorId);
        var imagesRef = firebase.database().ref('vendors/' + vendorId + '/images');
        this.bindAsObject(vendorRef, 'vendor');
        this.bindAsArray(imagesRef, 'images');

        // Watch for changes to the vendor session to 
        // place vendor on map
        this.vendorSessionRef = firebase.database().ref('vendor-sessions/' + vendorId);
        this.vendorSessionRef.limitToLast(1).on('child_added', function(snapshot) {
          var session = snapshot.val();
          var position = { lat: session.lat, lng: session.lng };
          var map = new google.maps.Map(document.getElementById('map'), {
            center: position,
            zoom: 15,
            disableDefaultUI: true,
            zoomControl: true
          });

          var marker = new google.maps.Marker({
            position: position,
            map: map,
            animation: google.maps.Animation.DROP
          });
        }.bind(this));
      }
    }.bind(this));
  },
  componentDidMount: function() {
    
  },
  componentWillUnmount: function() {
    this.vendorSessionRef.off();
  },
  render: function() {
    return (
      <div className="vendor-detail">
        {this.state.userIsOwner ?
          <div className="inner-container">
            <SessionButton />
          </div> : null }
        <ul className="image-list">
          {this.state.images.map(function(image) {
            return <li key={image['.key']} className="image-list-item"><img src={image.url} /></li>
          })}
          </ul>
        <div className="vendor-brand"><h2>{this.state.vendor.name}</h2></div>
        <div className="inner-container">
          <p>{this.state.vendor.description}</p>
        </div>
        <Tabs vendorId={this.state.vendor['.key']} menuId={this.state.vendor['.key']} />
      </div>
    )
  }
});

module.exports = Profile;