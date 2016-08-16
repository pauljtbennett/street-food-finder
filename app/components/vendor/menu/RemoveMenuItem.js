var React = require('react');

var RemoveMenuItem = React.createClass({
  removeItem: function() {
    var menuId = this.props.menuId;
    var itemId = this.props.itemId;
    var itemRef = firebase.database().ref('vendor-menu/' + menuId + '/items/' + itemId);
    itemRef.once('value').then(function(snapshot) {
      var confirmRemove = confirm("Remove " + snapshot.val().name + "?");
      if (confirmRemove) {
        itemRef.remove().then(function() {
          
        }.bind(this), function(error) {
          console.error(error);
        }.bind(this));
      }
    });
  },
  render: function() {
    return (
     <a onClick={this.removeItem}><i className="fa fa-close"></i></a> 
    )
  }
});

module.exports = RemoveMenuItem;