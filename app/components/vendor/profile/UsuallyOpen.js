var React = require('react');

var UsuallyOpen = React.createClass({
  vendorSessionRef: null,
  startTimes: [],
  endTimes: [],
  getInitialState: function() {
    return {
      avgStartTime: null,
      avgEndTime: null,
    }
  },
  componentWillMount: function() {
    // Grab the last 10 sessions from this vendor
    // and roughly calculate their average start and
    // end times
    var vendorId = this.props.vendor.id;
    this.startTimes = [];
    this.endTimes = [];
    this.vendorSessionRef = firebase.database().ref('vendor-sessions/' + vendorId);
    this.vendorSessionRef.limitToLast(10).on('child_added', function(snapshot) {
      var session = snapshot.val();
      var startTimesSum = 0, endTimesSum = 0;

      if (session.startTime !== -1) {
        var startDate = new Date(parseInt(session.startTime));
        var startTime = new Date(0);
        this.startTimes.push(startTime.setHours(startDate.getHours(), startDate.getMinutes()));
        for (i = 0; i < this.startTimes.length; i++) { startTimesSum += this.startTimes[i]; }
        var startAvg = new Date(parseInt((startTimesSum / this.startTimes.length).toFixed(0)));
        var roundedTime = this.roundTime(startAvg.getHours(), startAvg.getMinutes());
        this.setState({
          avgStartTime: roundedTime.hours + ':' + roundedTime.minutes
        });
      }

      if (session.endTime !== -1) {
        var endDate = new Date(parseInt(session.endTime));
        var endTime = new Date(0);
        this.endTimes.push(endTime.setHours(endDate.getHours(), endDate.getMinutes()));
        for (i = 0; i < this.endTimes.length; i++) { endTimesSum += this.endTimes[i]; }
        var endAvg = new Date(parseInt((endTimesSum / this.endTimes.length).toFixed(0)));
        var roundedTime = this.roundTime(endAvg.getHours(), endAvg.getMinutes());
        this.setState({
          avgEndTime: roundedTime.hours + ':' + roundedTime.minutes
        });
      }
    }.bind(this));
  },
  componentWillUnmount: function() {
    this.vendorSessionRef.off();
  },
  roundTime: function(hours, minutes) {
    var m = (parseInt((minutes + 7.5)/15) * 15) % 60;
    var h = minutes > 52 ? (hours === 23 ? 0 : ++hours) : hours;

    return {
      hours: h,
      minutes: m
    }
  },
  render: function() {
    return (
      <span className="usually-open">Usually open {this.state.avgStartTime} - {this.state.avgEndTime}</span>
    )
  }
});

module.exports = UsuallyOpen;