var React = require('react');
var Nearby = require('../components/customer/Nearby');

var NearbyContainer = React.createClass({
  geoQuery: null,
  geoWatchID: -1,
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },
  getInitialState: function() {
    return {
      vendorKeys: [],
      vendors: [],
      loading: true,
    }
  },
  componentWillMount: function() {
    if (navigator.geolocation) {
      this.geoWatchID = navigator.geolocation.watchPosition(function(position) {
        var georef = firebase.database().ref('vendor-geo');
        var geofire = new GeoFire(georef);
        var lat = parseFloat(position.coords.latitude);
        var lng = parseFloat(position.coords.longitude);

        // Set up a new geo query if one doesn't already
        // exist, otherwise update its criteria as we move around
        if (this.geoQuery === null) {
          this.geoQuery = geofire.query({
            center: [lat, lng],
            radius: 5
          });
        } else {
          this.geoQuery.updateCriteria({
            center: [lat, lng],
          });
        }
        this.geoQuery.on("key_entered", function(key, location, distance) {
          this.setState({
            loading: false
          });
          if (this.state.vendorKeys.indexOf(key) === -1) {
            this.setState({
              vendorKeys: this.state.vendorKeys.concat([key])
            });
            firebase.database().ref('vendors/' + key).once('value').then(function(snapshot) {
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
                vendor.id = key;
                vendor.distance = distance.toFixed(2);
                vendor.images = images;
                this.setState({
                  vendors: this.state.vendors.concat([vendor])
                });
              }
            }.bind(this));
          }
        }.bind(this));
      }.bind(this), function(error) {
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
  componentWillUnmount: function() {
    if (navigator.geolocation && this.geoWatchID !== -1) {
      navigator.geolocation.clearWatch(this.geoWatchID);
      this.geoWatchID = -1;
    }
    if (this.geoQuery !== null) {
      this.geoQuery.cancel();
      this.geoQuery = null;
    }
  },
  render: function() {
    return <Nearby 
      vendors={this.state.vendors}
      loading={this.state.loading}
      />
  }
});

module.exports = NearbyContainer;