var React = require('react');

var MapTab = React.createClass({
  vendorSessionRef: null,
  getInitialState: function() {
    return {
      position: {}
    }
  },
  componentWillReceiveProps: function(props) {
    if (props.vendorId && this.vendorSessionRef === null) {
      // Watch for changes to the vendor session to 
      // place vendor on map
      var vendorId = props.vendorId;
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

        this.setState({
          position: position
        });
      }.bind(this));
    }
  },
  componentWillUnmount: function() {
    if (this.vendorSessionRef !== null) {
      this.vendorSessionRef.off();
    }
  },
  openDirections: function(e) {
    var url = 'https://maps.google.com?saddr=Current+Location&daddr=';
    url += this.state.position.lat + ',';
    url += this.state.position.lng;
    window.open(url, '_blank');
  },
  render: function() {
    return (
      <div>
        <div className="inner-container">
          <button className="btn full-width" onClick={this.openDirections}>Get Directions</button>
        </div>
        <div id="map" className="map"></div>
      </div>
    )
  }
});

module.exports = MapTab;