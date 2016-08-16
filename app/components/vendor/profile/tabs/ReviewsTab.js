var React = require('react');
var classnames = require('classnames');

var ReviewsTab = React.createClass({
  refsBound: false,
  mixins: [ReactFireMixin],
  getInitialState: function() {
    return {
      reviews: null,
      loading: true,
    }
  },
  componentWillReceiveProps: function(props) {
    if (!this.refsBound && props.vendorId) {  
      this.refsBound = true;
      var vendorId = props.vendorId;
      var reviewsRef = firebase.database().ref('vendor-reviews/' + vendorId);
      this.bindAsArray(reviewsRef, 'reviews');

      // Do a one-time check for empty results array
      reviewsRef.once('value').then(function(snapshot) {
        if (snapshot.val() === null) {
          this.setState({
            reviews: []
          });
        }
      }.bind(this));
    }
  },
  componentDidUpdate: function(props, state) {
    if (state.reviews !== null && this.state.loading) {
      this.setState({
        loading: false
      });
    }
  },
  render: function() {
    var classes = classnames('review-list loadable-list', { 'loading': this.state.loading });
    return (
      <ul className={classes}>
        <li className="loader"><i className="fa fa-circle-o-notch fa-spin fa-fw"></i></li>
        {this.state.reviews !== null ? this.state.reviews.map(function(review) {
          
        }) : null}
      </ul>
    )
  }
});

module.exports = ReviewsTab;