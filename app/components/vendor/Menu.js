var React = require('react');
var ReactRouter = require('react-router');
var MenuItem = require('./menu/MenuItem.js');
var AddMenuItem = require('./menu/AddMenuItem.js');
var classnames = require('classnames');

var Menu = React.createClass({
  mixins: [ReactFireMixin],
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },
  getInitialState: function() {
    return {
      menu: null,
      items: null,
      loading: true,
    }
  },
  componentWillMount: function() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        var menuRef = firebase.database().ref('vendor-menu/' + user.uid);
        var itemsRef = firebase.database().ref('vendor-menu/' + user.uid + '/items');
        this.bindAsObject(menuRef, 'menu');
        this.bindAsArray(itemsRef, 'items');

        // If the menu doesn't exist at this point, create one now
        menuRef.once('value').then(function(snapshot) {
          if (snapshot.val() === null) {
            menuRef.set({
              name: 'Menu',
            });

            // Firebase doesn't store empty arrays, trick our state
            // to think we have one already
            this.setState({
              items: []
            });
          }
        }.bind(this), function(error) {
          console.log(error);
        }.bind(this));
      }
    }.bind(this));
  },
  componentDidUpdate: function(props, state) {
    if (state.items !== null && state.loading) {
      this.setState({
        loading: false
      });
    }
  },
  render: function() {
    var classes = classnames('menu-list loadable-list', { 'loading': this.state.loading });
    return (
      <div>
        <div className="inner-container">
          <h2 className="plain">Menu <span className="items-count">({this.state.items !== null ? this.state.items.length : '0'} items)</span></h2>
          <p>Add, remove or re-order your daily menu items here.</p>
          <AddMenuItem />
        </div>

        <ul className={classes}>
          <li className="loader"><i className="fa fa-circle-o-notch fa-spin fa-fw"></i></li>
          {this.state.menu !== null && this.state.items !== null ? this.state.items.map(function(item) {
            return <MenuItem key={item['.key']} menu={this.state.menu} item={item} allowRemove={true} />
          }.bind(this)) : null}
        </ul>
      </div>
    )
  }
});

module.exports = Menu;