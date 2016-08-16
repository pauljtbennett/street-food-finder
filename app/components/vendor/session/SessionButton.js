var React = require('react');
var classnames = require('classnames');

var SessionButton = React.createClass({
  mixins: [ReactFireMixin],
  getInitialState: function() {
    return {
      vendor: {},
    }
  },
  componentWillMount: function() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        var vendorRef = firebase.database().ref('vendors/' + user.uid);
        this.bindAsObject(vendorRef, 'vendor');
      }
    }.bind(this));
  },
  onUpdateStatus: function(e) {
    e.preventDefault();
    var user = firebase.auth().currentUser;
    var active = this.state.vendor.active;
    var vendorId = user.uid;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var georef = firebase.database().ref('vendor-geo');
        var geofire = new GeoFire(georef);
        var lat = parseFloat(position.coords.latitude);
        var lng = parseFloat(position.coords.longitude);

        // Update the vendor's active status
        firebase.database().ref('vendors/' + vendorId).update({
          active: !active,
        });

        // If the vendor is currently active end their 
        // session, otherwise start a new session
        if (active) {
          firebase.database().ref('vendor-sessions/' + vendorId).limitToLast(1).once('child_added').then(function(snapshot) {
            firebase.database().ref('vendor-sessions/' + vendorId + '/' + snapshot.key).update({
              endTime: Date.now()
            });
          }, function(error) {
            console.log("Error retrieving last vendor session");
          });
        } else {
          firebase.database().ref('vendor-sessions/' + vendorId).push({
            startTime: Date.now(),
            endTime: -1,
            lat: lat,
            lng: lng
          });
        }
        
        // Store the vendor's current location for 
        // geo-querying by customers
        geofire.set(vendorId, [lat, lng]).then(function() {
          console.log("Geo updated");
        }, function(error) {
          console.error("Error saving location");
        });
      }, function(error) {
        console.error("Error getting location");
      }, {
        enableHighAccuracy: true,
        timeout: 60000,
        maximumAge: 300000
      });
    } else {
      console.error("Device doesn't support location");
    }
  },
  render: function() {
    var classes = classnames('btn full-width', { 'btn-success': !this.state.vendor.active, 'btn-danger': this.state.vendor.active });
    return (
      <button className={classes} onClick={this.onUpdateStatus}>{!this.state.vendor.active ? 'Open for business' : 'Close'}</button>
    )
  }
});

module.exports = SessionButton;