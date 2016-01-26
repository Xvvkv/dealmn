var WishListItemButtons = require('./../wish_list_item_buttons.jsx');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

var UserProfileWishListItem = React.createClass({
  render: function(){
    var wish_list_item_buttons = <WishListItemButtons item={this.props.item} handleDeleteWishListItem={this.props.handleDeleteWishListItem.bind(null,this.props.item.id)}/>
    return (
      <div className="profile-user-deals">
        <div className="profile-user-deals-img"><img src={this.props.item.listing.images && this.props.item.listing.images.length > 0 ? this.props.item.listing.images[0].url : '/images/no_image_large.jpg'} /></div>
        <div className="profile-user-deals-name"><a href={'/listings/' + this.props.item.listing.id}>{this.props.item.listing.title}</a></div>
        <div className="profile-user-deals-information">{this.props.item.listing.text_description}</div>
        <div className="hairly-line" />
        <div className="profile-user-deals-buttons">
          <div>
            {wish_list_item_buttons}
          </div>
        </div>
      </div>
    );
  }
})

var UserProfileWishListSection = React.createClass({
  componentDidMount: function() {
    if(!this.props.loaded){
      this.props.loadData();
    }
  },
  render: function(){
    var panel;
    if(this.props.loaded){
      var wish_list = Object.keys(this.props.wish_list).sort(function(a, b){return b-a}).map(function(id) {
        return (
          <UserProfileWishListItem key={id} item={this.props.wish_list[id]} handleDeleteWishListItem={this.props.handleDeleteWishListItem} />
        );
      }.bind(this));

      panel = (
        <div>
          {wish_list.length == 0 && <div className="alert alert-info" role="alert">Дугуйлсан тохиролцоо байхгүй байна.</div>}
          <ReactCSSTransitionGroup transitionName="fadeInOut" transitionEnterTimeout={300} transitionLeaveTimeout={200}>
            {wish_list}
          </ReactCSSTransitionGroup>
        </div>
      );
    }else{
      panel = <div className="page-loader" />
    }
    return (
        <div className="profile-right">
          <div className="home-module-title big-title">Дугуйлсан тохиролцоо</div>
          {panel}
        </div>
      );;
  }
})

module.exports = UserProfileWishListSection