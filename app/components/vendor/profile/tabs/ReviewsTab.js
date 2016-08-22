var React = require('react');
var Review = require('../Review');
var classnames = require('classnames');

var ReviewsTab = React.createClass({
  refsBound: false,
  mixins: [ReactFireMixin],
  getInitialState: function() {
    return {
      reviews: null,
      loading: true,
      reviewContent: '',
      reviewScore: 0,
      canReview: false,
    }
  },
  componentWillReceiveProps: function(props) {
    if (!this.refsBound && props.vendorId) {  
      this.refsBound = true;
      var vendorId = props.vendorId;
      var reviewsRef = firebase.database().ref('vendor-reviews/' + vendorId);
      this.bindAsArray(reviewsRef, 'reviews');

      // Do a one-time check for empty results array,
      // also check to determine if current user can
      // leave a review
      reviewsRef.once('value').then(function(snapshot) {
        var alreadyReviewed = false;
        if (snapshot.val() === null) {
          this.setState({
            reviews: []
          });
        } else {
          var userReviews = Object.keys(snapshot.val()).map(function(key) { return snapshot.val()[key] });
          userReviews = userReviews.filter(function(review) {
            return firebase.auth().currentUser.uid === review.author;
          });
          alreadyReviewed = userReviews.length > 0;
        }

        if (firebase.auth().currentUser.uid !== vendorId && !alreadyReviewed) {
          this.setState({
            canReview: true
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
  onUpdateReviewContent: function(e) {
    this.setState({
      reviewContent: e.target.value
    });
  },
  onUpdateReviewScore: function(e) {
    this.setState({
      reviewScore: e.target.value
    });
  },
  handleSubmitReview: function(e) {
    e.preventDefault();

    if (this.state.reviewScore < 1) {
      console.error("review score too low");
      return;
    }

    firebase.database().ref('vendor-reviews/' + this.props.vendorId).push({
      author: firebase.auth().currentUser.uid,
      content: this.state.reviewContent,
      stars: this.state.reviewScore,
      timestamp: Date.now(),
    }).then(function() {
      // Calculate new vendor rating
      var totalScore = 0;
      this.state.reviews.map(function(review) {
        totalScore += parseInt(review.stars);
      });

      if (this.state.reviews.length > 0) {
        // Fire-and-forget
        firebase.database().ref('vendors/' + this.props.vendorId).update({
          avgRating: totalScore / this.state.reviews.length
        }); 
      }
    }.bind(this));

    this.setState({
      reviewContent: '',
      reviewScore: 0,
    });
  },
  render: function() {
    var classes = classnames('review-list loadable-list', { 'loading': this.state.loading });
    var stateScore = this.state.reviewScore;
    var that = this;
    return (
      <div>
        {this.state.canReview ? <div className="inner-container">
          <h3 className="plain">Add Review</h3>
          <form onSubmit={this.handleSubmitReview}>
            <div className="form-group star-rating-group">
              <label className="group-label">Score</label>
              {Array.apply(0, Array(5)).map(function(x, i) {
                var score = i + 1
                return <div key={i}>
                  <input type="radio" name="stars" id={'star' + score} value={score} checked={stateScore == score} onChange={that.onUpdateReviewScore} />
                  <label htmlFor={'star' + score}><i className={classnames('fa', {'fa-star': stateScore >= score, 'fa-star-o': stateScore < score})}></i></label>
                </div>
              }.bind(that))}
            </div>

            <div className="form-group">
              <label htmlFor="content">Review</label>
              <textarea name="content" id="content" className="form-control" value={this.state.reviewContent} onChange={this.onUpdateReviewContent} />
            </div>
            <button type="submit" className="btn btn-success full-width">Submit</button>
          </form>
        </div> : null }
        <ul className={classes}>
          <li className="loader"><i className="fa fa-circle-o-notch fa-spin fa-fw"></i></li>
          {this.state.reviews !== null ? this.state.reviews.map(function(review) {
            return <Review
              key={review['.key']}
              author={review.author}
              content={review.content}
              score={review.stars}
              />
          }) : null}
        </ul>
      </div>
    )
  }
});

module.exports = ReviewsTab;