var UserProfileWishListSection = require('./user_profile_sections/wish_list.jsx');

var WishListGuestPage = React.createClass({
  getInitialState: function() {
    return {
      wish_list_items: {}, // used in wish list page (viewing own profile)
      wish_list_items_loaded: false
    };
  },
  loadWishListItems: function () {
    console.log('loadWishListItems called');
    if(!this.state.wish_list_items_loaded){
      console.log('loading...');
      $.ajax({
        url: '/rest/wish_lists.json?include_detail=1',
        dataType: 'json',
        success: function (res) {
          this.setState({
            wish_list_items: res.items.reduce(function(items, item) { items[item.id] = item; return items; }, {}),
            wish_list_items_loaded: true
          });
        }.bind(this),
        error: function (xhr, status, err) {
          console.error('/rest/wish_lists.json', status, err.toString());
        }.bind(this)
      });
    }
  },
  _handleDeleteWishListItem: function(id){
    var items = this.state.wish_list_items;
    delete items[id]
    this.setState({wish_list_items: items});
  },
  render: function(){
    return (
      <div className="main">
        <div className="container">
          <div className="full-width">
            <UserProfileWishListSection loadData={this.loadWishListItems} loaded={this.state.wish_list_items_loaded} wish_list={this.state.wish_list_items} handleDeleteWishListItem={this._handleDeleteWishListItem}/>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = WishListGuestPage;