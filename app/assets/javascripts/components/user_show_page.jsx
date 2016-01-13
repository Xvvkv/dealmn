var Rater = require('react-rater');
var Rating = require('./fixed_star_rate.jsx');

var UserProfileListingsSection = require('./user_profile_sections/listings.jsx');
var UserProfileBidsSection = require('./user_profile_sections/bids.jsx');
var UserProfileMessagesSection = require('./user_profile_sections/messages.jsx');
var UserProfileWishListSection = require('./user_profile_sections/wish_list.jsx');
var UserProfileNotificationsSection = require('./user_profile_sections/notifications.jsx');

var UserShowPage = React.createClass({
  getInitialState: function() {
    return {
      user: {},
      user_loaded: false,
      rightPanel: 'listing',
      listings: {},
      listings_loaded: false,
      wish_list: null, // used in listing page (viewing someone else's profile)
      wish_list_items: {}, // used in wish list page (viewing own profile)
      wish_list_items_loaded: false,
      bids: [],
      bids_loaded: false,
      messages: [],
      messages_loaded: false,
      notifications: [],
      notifications_loaded: false
    };
  },
  componentWillMount: function(){
    var anchor = window.location.hash.substring(1);
    if(anchor){
      if(["notification","wishlist","message"].indexOf(anchor) >= 0){
        this.setState({rightPanel: anchor});
      }
    }
  },
  componentDidMount: function() {
    this.loadDataFromServer();
  },
  loadDataFromServer: function () {
    $.ajax({
      url: '/rest/users/' + this.props.user_id + '.json',
      dataType: 'json',
      success: function (user) {
        this.setState({
          user: user,
          user_rating: user.user_stat.current_user_rating,
          user_loaded: true
        });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error('/rest/users.json', status, err.toString());
      }.bind(this)
    });
    if(this.props.user_id != this.props.current_user_id){
      $.ajax({
        url: '/rest/wish_lists.json',
        dataType: 'json',
        success: function (wish_list) {
          this.setState({wish_list: wish_list});
        }.bind(this),
        error: function (xhr, status, err) {
          console.error('/rest/wish_lists.json', status, err.toString());
        }.bind(this)
      });
    }
  },
  loadListings: function () {
    console.log('loadListings called');
    if(!this.state.listings_loaded){
      console.log('loading...');
      $.ajax({
        url: '/rest/users/' + this.props.user_id + '/listings.json',
        dataType: 'json',
        success: function (listings) {
          this.setState({
            listings: listings.reduce(function(listings, listing) { listings[listing.id] = listing; return listings; }, {}),
            listings_loaded: true
          });
        }.bind(this),
        error: function (xhr, status, err) {
          console.error('/rest/listings.json', status, err.toString());
        }.bind(this)
      });
    }
  },
  loadWishListItems: function () {
    console.log('loadWishListItems called');
    if(!this.state.wish_list_items_loaded){
      console.log('loading...');
      $.ajax({
        url: '/rest/users/' + this.props.user_id + '/wish_lists.json',
        dataType: 'json',
        success: function (items) {
          this.setState({
            wish_list_items: items.reduce(function(items, item) { items[item.id] = item; return items; }, {}),
            wish_list_items_loaded: true
          });
        }.bind(this),
        error: function (xhr, status, err) {
          console.error('/rest/wish_lists.json', status, err.toString());
        }.bind(this)
      });
    }
  },
  _handleUserRate: function(rating, last_rating){
    if(this.state.user_loaded && this.state.user.id != this.props.current_user_id){
      $.ajax({
        url: '/rest/user_ratings',
        type: "post",
        dataType: 'json',
        data: {rating: rating, id: this.state.user.id},
        success: function (rating) {
          u_updated = this.state.user
          u_updated.user_stat.rating = +((u_updated.user_stat.rating_sum + rating.rating) / (u_updated.user_stat.rating_count + 1)).toFixed(1)
          u_updated.user_stat.rating_count += 1
          this.setState({
            user_rating: rating.rating,
            user: u_updated
          });
        }.bind(this),
        error: function (xhr, status, err) {
          console.error('/rest/user_ratings', status, err.toString());
          $.growl.error({ title: '', message: "Алдаа гарлаа" , location: "br", delayOnHover: true});
        }.bind(this)
      });
    }
  },
  _handleRightPanelChange: function(rightPanel){
    this.setState({rightPanel: rightPanel});
  },
  _handleWishList: function(id){
    var wish_list = this.state.wish_list
    wish_list.push(id);
    this.setState({wish_list: wish_list});
  },
  _handleRevertWishList: function(id){
    var wish_list = this.state.wish_list
    var index = wish_list.indexOf(id);
    if (index > -1) {
      wish_list.splice(index, 1);
    }
    this.setState({wish_list: wish_list});
  },
  _handleCloseListing: function(id){
    var listings = this.state.listings;
    if(listings[id]){
      listings[id].is_closed = true
    }
    this.setState({listings: listings});
  },
  _handleDeleteWishListItem: function(id){
    var items = this.state.wish_list_items;
    delete items[id]
    this.setState({wish_list_items: items});
  },
  render: function(){
    var right_panel;
    if(this.props.user_id != this.props.current_user_id || this.state.rightPanel == 'listing'){
      right_panel = <UserProfileListingsSection {...this.props} loadData={this.loadListings} loaded={this.state.listings_loaded} listings={this.state.listings} wish_list={this.state.wish_list} handleWishList={this._handleWishList} handleRevertWishList={this._handleRevertWishList} handleCloseListing={this._handleCloseListing}/>
    }else if(this.state.rightPanel == 'bid'){
      right_panel = <UserProfileBidsSection />
    }else if(this.state.rightPanel == 'wishlist'){
      right_panel = <UserProfileWishListSection loadData={this.loadWishListItems} loaded={this.state.wish_list_items_loaded} wish_list={this.state.wish_list_items} handleDeleteWishListItem={this._handleDeleteWishListItem}/>
    }else if(this.state.rightPanel == 'message'){
      right_panel = <UserProfileMessagesSection />
    }else if(this.state.rightPanel == 'notification'){
      right_panel = <UserProfileNotificationsSection />
    }
    return (
      <div className="main">
        <div className="container">
          <ProfileViewer handleRate={this._handleUserRate} rating={this.state.user_rating} current_user_id={this.props.current_user_id} user={this.state.user} loaded={this.state.user_loaded} rightPanel={this.state.rightPanel} handleRightPanelChange={this._handleRightPanelChange} />
          {right_panel}
        </div>
      </div>
    );
  }
})

var ProfileEditor = React.createClass({
  render: function(){
    return (
      <div className="profile-left">
      </div>
    );
  }
})

var ProfileViewer = React.createClass({
  render: function(){
    var rater
    if(this.props.loaded){
      if(this.props.user.id != this.props.current_user_id){
        rater = this.props.rating ? <Rating rating={Math.round(this.props.rating)}/> : <Rater onRate={this.props.handleRate}/>;
      }else{
        rater = <Rating rating={Math.round(this.props.user.user_stat.rating)} />
      }
    }

    var links
    if(this.props.user.id == this.props.current_user_id){
      links = (
        <div>
          <ul className="nav nav-pills nav-stacked">
            <li role="presentation" className={this.props.rightPanel == 'listing' ? 'active' :''}><a href="javascript:;" onClick={this.props.handleRightPanelChange.bind(null,'listing')}>Таны оруулсан тохиролцоо</a></li>
            <li role="presentation" className={this.props.rightPanel == 'bid' ? 'active' :''}><a href="javascript:;" onClick={this.props.handleRightPanelChange.bind(null,'bid')}>Ирсэн саналууд<span className="badge">5</span></a></li>
            <li role="presentation" className={this.props.rightPanel == 'wishlist' ? 'active' :''}><a href="javascript:;" onClick={this.props.handleRightPanelChange.bind(null,'wishlist')}>Дугуйлсан тохиролцоо<span className="badge">5</span></a></li>
            <li role="presentation" className={this.props.rightPanel == 'message' ? 'active' :''}><a href="javascript:;" onClick={this.props.handleRightPanelChange.bind(null,'message')}>Захиа<span className="badge">1</span></a></li>
            <li role="presentation" className={this.props.rightPanel == 'notification' ? 'active' :''}><a href="javascript:;" onClick={this.props.handleRightPanelChange.bind(null,'notification')}>Сонордуулга<span className="badge">1</span></a></li>
          </ul>
          <div className="hairly-line" />
        </div>
      );
    }

    return (
      <div className="profile-left">
        <div className="profile-img">
          <img src={this.props.user.prof_pic ? this.props.user.prof_pic : '/images/no_avatar.png'} />
        </div>
        <div className="profile-name">
          {this.props.user.full_name}
        </div>
        <div className="profile-rank">
          <div className="ranking-stars">
            {rater} <span>{(this.props.user.user_stat && this.props.user.user_stat.rating) ? ('(' + this.props.user.user_stat.rating + ')') : ''}</span>
          </div>
          <div className="full-detail-user-info-raters">{I18n.page.user_info.rating_count}: {this.props.user.user_stat ? this.props.user.user_stat.rating_count : ''}</div>
        </div>
        <div className="hairly-line" />
        {links}
        <div className="full-detail-user-info-deals">
          <div className="full-detail-user-info-deals-reg"><span className="glyphicon glyphicon-calendar"></span> {I18n.page.user_info.registered}: {this.props.user.registered_date}</div>
          <div className="full-detail-user-info-deals-all-deal"><span className="glyphicon glyphicon-tags"></span> {I18n.page.user_info.total_listing}: {this.props.user.user_stat ? this.props.user.user_stat.total_listing : ''}</div>
          <div className="full-detail-user-info-deals-active-deal"><span className="glyphicon glyphicon-tags"></span> {I18n.page.user_info.total_active_listing}: {this.props.user.user_stat ? this.props.user.user_stat.total_active_listing : ''}</div>
          <div className="full-detail-user-info-deals-done-deal"><span className="glyphicon glyphicon-ok"></span> {I18n.page.user_info.total_accepted_bid}: {this.props.user.user_stat ? this.props.user.user_stat.total_accepted_bid : ''}</div>
          <div className="full-detail-user-info-deals-phone"><span className="glyphicon glyphicon-phone"></span> {I18n.page.user_info.phone}: {this.props.user.primary_contact ? this.props.user.primary_contact.phone : ''}</div>
          <div className="full-detail-user-info-deals-email"><span className="glyphicon glyphicon-envelope"></span> {I18n.page.user_info.email}: {this.props.user.primary_contact ? this.props.user.primary_contact.email : ''}</div>
          <div className="hairly-line" />
          <div className="text-center">
            {this.props.user.id == this.props.current_user_id && <div className="btn btn-warning" style={{width: '50%'}}>{I18n.page.user_info.edit}</div>}
          </div>
        </div>
      </div>
    );
  }
})

module.exports = UserShowPage;