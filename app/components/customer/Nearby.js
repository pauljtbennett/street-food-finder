var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
var classnames = require('classnames');

var Nearby = React.createClass({
  render: function() {
    var classes = classnames('vendor-list loadable-list', { 'loading': this.props.loading });
    return (      
      <ul className={classes}>
        <li className="loader"><i className="fa fa-circle-o-notch fa-spin fa-fw"></i></li>
        {this.props.vendors.sort(function(a, b) { return a.distance > b.distance }).map(function(vendor) {
          return <li key={vendor.id} className="vendor-list-item">
            <Link to={'customer/vendor/' + vendor.id}>
              <div className="vendor-image">
                {vendor.images.map(function(image) {
                  return <img key={image.id} src={image.url} />
                })}
              </div>
              <ul className="vendor-data">
                <li>{vendor.name} | $$ | {vendor.distance}km</li>
                <li>Usually open 11:00 - 15:00</li>
                <li className="star-rating">
                  <span className="rating">4.3</span>                
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star"></i>
                  <i className="fa fa-star-half-o"></i>
                </li>
              </ul>
            </Link>
          </li>
        })}
      </ul>
    )
  }
});

module.exports = Nearby;