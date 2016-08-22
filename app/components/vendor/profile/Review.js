var React = require('react');
var StarRating = require('./StarRating');

var Review = React.createClass({
  mixins: [ReactFireMixin],
  getInitialState: function() {
    return {
      author: {},
    }
  },
  componentWillMount: function() {
    var authorRef = firebase.database().ref('users/' + this.props.author);
    this.bindAsObject(authorRef, 'author');
  },
  render: function() {
    return (
      <li className="review-list-item">
        <div className="review-meta">
          <span className="review-author left">{this.state.author.displayName}</span>
          <div className="right"><StarRating stars={this.props.score} /></div>
        </div>
        <p className="review-content">{this.props.content}</p>
      </li>
    )
  }
});

module.exports = Review;