var WishListButton = require('./../wish_list_button.jsx');
var ListingItemButtons = require('./../listing_item_buttons.jsx');

var UserProfileListingsItem = React.createClass({
  render: function(){
    
    var wish_list_button;
    if(this.props.wish_listed != null){
      wish_list_button = <WishListButton current_user_id={this.props.current_user_id} listing={this.props.listing} handleWishList={this.props.handleWishList} handleRevertWishList={this.props.handleRevertWishList} wish_listed={this.props.wish_listed} />;
    }
    var listing_item_buttons = <ListingItemButtons current_user_id={this.props.current_user_id} listing={this.props.listing} handleCloseListing={this.props.handleCloseListing.bind(null,this.props.listing.id)} is_closed={this.props.listing.is_closed}/>
    
    return (
      <div className="profile-user-deals">
        <div className="profile-user-deals-img"><img src={this.props.listing.images && this.props.listing.images.length > 0 ? this.props.listing.images[0].url : '/images/123.jpg'} /></div>
        <div className="profile-user-deals-name"><a href={'/listings/' + this.props.listing.id}>{this.props.listing.title}</a></div>
        <div className="profile-user-deals-information">{this.props.listing.text_description}</div>
        <div className="hairly-line" />
        <div className="profile-user-deals-buttons">
          <div style={{float: 'left'}}>
            {wish_list_button}
          </div>
          <div>
            {listing_item_buttons}
          </div>
        </div>
      </div>
    );
  }
})

var UserProfileListingsSection = React.createClass({
  componentDidMount: function() {
    if(!this.props.loaded){
      this.props.loadData();
    }
  },
  render: function(){
    var panel;
    if(this.props.loaded){
      var listings = Object.keys(this.props.listings).sort(function(a, b){return b-a}).map(function(id,index) {
        return (
          <UserProfileListingsItem key={index} listing={this.props.listings[id]} current_user_id={this.props.current_user_id} handleWishList={this.props.handleWishList} handleRevertWishList={this.props.handleRevertWishList} handleCloseListing={this.props.handleCloseListing} wish_listed={this.props.wish_list ? this.props.wish_list.indexOf(parseInt(id)) > -1 : null} />
        );
      }.bind(this));

      panel = (
        <div className="profile-right">
          <div className="home-module-title big-title">{this.props.user_id == this.props.current_user_id ? 'Таны' : 'Хэрэглэгчийн'} оруулсан тохиролцоо</div>
          {this.props.listings.length == 0 && <div className="alert alert-info" role="alert">Тохиролцоо оруулаагүй байна.</div>}
          {listings}
        </div>
      );
    }else{
      panel = <div>loader</div>
    }
    return panel;
  }
})

module.exports = UserProfileListingsSection