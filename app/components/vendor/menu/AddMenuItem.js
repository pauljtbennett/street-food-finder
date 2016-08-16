var React = require('react');

var AddMenuItem = React.createClass({
  getInitialState: function() {
    return {
      itemName: '',
      itemDesc: '',
      itemPrice: '',
    }
  },
  onUpdateItemName: function(e) {
    this.setState({
      itemName: e.target.value
    });
  },
  onUpdateItemDesc: function(e) {
    this.setState({
      itemDesc: e.target.value
    });
  },
  onUpdateItemPrice: function(e) {
    this.setState({
      itemPrice: e.target.value
    });
  },
  addItem: function(e) {
    e.preventDefault();
    var user = firebase.auth().currentUser;
    firebase.database().ref('vendor-menu/' + user.uid + '/items').push({
      name: this.state.itemName,
      description: this.state.itemDesc,
      price: this.state.itemPrice,
    }).then(function() {
      this.setState({
        itemName: '',
        itemDesc: '',
        itemPrice: '',
      });
    }.bind(this), function(error) {
      console.error(error);
    }.bind(this));
  },
  render: function() {
    var that = this;
    return (
        <form onSubmit={this.addItem}>
          <div className="form-group">
            <input type="text" name="fname" id="fname" className="form-control top" placeholder="Name" required value={this.state.itemName} onChange={this.onUpdateItemName} />
          </div>
          <div className="form-group">
            <input type="text" name="description" id="description" className="form-control mid" placeholder="Description" value={this.state.itemDesc} onChange={this.onUpdateItemDesc} />
          </div>
          <div className="form-group">
            <input type="number" name="price" id="price" className="form-control bottom" placeholder="Price" required value={this.state.itemPrice} onChange={this.onUpdateItemPrice} />
          </div>
          <button type="submit" className="btn full-width">Add item</button>
        </form>
    )
  }
});

module.exports = AddMenuItem;