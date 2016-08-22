var React = require('react');
var RemoveMenuItem = require('./RemoveMenuItem');

var MenuItem = React.createClass({
  render: function() {
    var that = this;
    return (
      <li className="menu-list-item">
        <div className="left">
          <span className="item-name">{this.props.item.name}</span>
          <p className="item-description">{this.props.item.description}</p>
        </div>
        <div className="right">
          <span className="item-price">${parseFloat(this.props.item.price).toFixed(2)}</span>
          {this.props.allowRemove ? <RemoveMenuItem menuId={this.props.menu['.key']} itemId={this.props.item['.key']} /> : null }
        </div>
      </li>
    )
  }
});

module.exports = MenuItem;