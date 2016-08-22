var React = require('react');
var ReactRouter = require('react-router');
var SessionButton = require('./session/SessionButton');
var UsuallyOpen = require('./profile/UsuallyOpen');
var StarRating = require('./profile/StarRating');
var Tabs = require('./profile/Tabs');

var Profile = React.createClass({
  mixins: [ReactFireMixin],
  imagesLoaded: 0,
  flickityCarousel: null,
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
      }
    }.bind(this));
  },
  componentDidMount: function() {
    // Initialise the carousel here as it doesn't
    // require any data at this point
    this.flickityCarousel = new Flickity('.carousel', {
      setGallerySize: false,
      imageLoad: true,
      wrapAround: true,
      lazyLoad: true,
      pageDots: false,
    });
  },
  componentDidUpdate: function(prevProps, prevState) {
    // At this point we can safely reload flickity to include
    // any new images that may have loaded
    if (this.flickityCarousel !== null && prevState.images.length > this.imagesLoaded) {
      var allImages = document.getElementsByClassName('image-list-item');
      var lastImage = allImages[allImages.length - 1];
      this.flickityCarousel.append(lastImage);
      this.imagesLoaded = prevState.images.length;
    }
  },
  render: function() {
    return (
      <div className="vendor-detail">
        {this.state.userIsOwner ?
          <div className="inner-container">
            <SessionButton />
          </div> : null }
        <div className="image-list-container">
          <div className="image-list carousel">
            {this.state.images.map(function(image) { 
              return <div key={image['.key']} className="image-list-item carousel-cell">
                <img data-flickity-lazyload={image.url} />
              </div>
            })}
            </div>
        </div>    
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