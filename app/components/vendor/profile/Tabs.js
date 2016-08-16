var React = require('react');
var MenuTab = require('./tabs/MenuTab');
var ReviewsTab = require('./tabs/ReviewsTab');

var Tabs = React.createClass({
  selectTab: function(tab, e) {
    var selectedTab = document.getElementById('tab-' + tab);
    var allTabs = document.getElementsByClassName('tab-container-item');
    var allButtons = document.getElementsByClassName('tab-nav-item');
    for (var i = 0; i < allTabs.length; i++) { allTabs[i].classList.remove('visible'); }
    for (var i = 0; i < allButtons.length; i++) { allButtons[i].classList.remove('active'); }
    selectedTab.classList.add('visible');
    e.target.parentNode.classList.add('active');
  },
  render: function() {
    var that = this;
    return (
      <div className="tabs">
        <ul className="tab-nav">
          <li className="tab-nav-item"><a onClick={that.selectTab.bind(that, 'menu')}>Menu</a></li>
          <li className="tab-nav-item active"><a onClick={that.selectTab.bind(that, 'map')}>Map</a></li>
          <li className="tab-nav-item"><a onClick={that.selectTab.bind(that, 'reviews')}>Reviews</a></li>
        </ul>
        <div className="tab-container">
          <div className="tab-container-item" id="tab-menu">
            <MenuTab menuId={this.props.menuId} />
          </div>
          <div className="tab-container-item visible" id="tab-map">
            <div id="map" className="map"></div>
          </div>
          <div className="tab-container-item" id="tab-reviews">
            <ReviewsTab vendorId={this.props.vendorId} />
          </div>
        </div>
      </div>
    )
  }
});

module.exports = Tabs;