var React = require('react');
var classnames = require('classnames');

var StarRating = React.createClass({
  getDefaultProps: function() {
    return {
      stars: 0,
      showNumber: false,
    }
  },
  render: function() {
    var stars = Math.round(parseFloat(this.props.stars));
    return (
      <div className="star-rating">
        {this.props.showNumber ? <span className="rating">{this.props.stars.toFixed(1)}</span> : null}
        {Array.apply(0, Array(5)).map(function(x, i) {
          var classes = classnames('fa', {'fa-star': i < stars, 'fa-star-o': i >= stars})
          return <i key={i} className={classes}></i>
        })}
      </div>
    )
  }
});

module.exports = StarRating;