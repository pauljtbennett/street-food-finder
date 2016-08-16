var React = require('react');
var MenuItem = require('../../menu/MenuItem');
var classnames = require('classnames');

var MenuTab = React.createClass({
  refsBound: false,
  mixins: [ReactFireMixin],
  getInitialState: function() {
    return {
      menu: null,
      items: null,
      loading: true,
    }
  },
  componentWillReceiveProps: function(props) {
    if (!this.refsBound && props.menuId) {  
      this.refsBound = true;
      var menuId = props.menuId;
      var menuRef = firebase.database().ref('vendor-menu/' + menuId);
      var itemsRef = firebase.database().ref('vendor-menu/' + menuId + '/items');
      this.bindAsObject(menuRef, 'menu');
      this.bindAsArray(itemsRef, 'items');

      // Do a one-time check for empty results array
      itemsRef.once('value').then(function(snapshot) {
        if (snapshot.val() === null) {
          this.setState({
            items: []
          });
        }
      }.bind(this));
    }
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
      <ul className={classes}>
        <li className="loader"><i className="fa fa-circle-o-notch fa-spin fa-fw"></i></li>
        {this.state.items !== null ? this.state.items.map(function(item) {
          return <MenuItem key={item['.key']} item={item} />
        }) : null}
      </ul>
    )
  }
});

module.exports = MenuTab;