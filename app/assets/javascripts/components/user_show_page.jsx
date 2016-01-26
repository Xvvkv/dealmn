var Rater = require('react-rater');
var Rating = require('./fixed_star_rate.jsx');

var UserProfileListingsSection = require('./user_profile_sections/listings.jsx');
var UserProfileBidsSection = require('./user_profile_sections/bids.jsx');
var UserProfileMessagesSection = require('./user_profile_sections/messages.jsx');
var UserProfileWishListSection = require('./user_profile_sections/wish_list.jsx');
var UserProfileNotificationsSection = require('./user_profile_sections/notifications.jsx');
var UserProfileMessageSenderSection = require('./user_profile_sections/message_sender.jsx');

$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return results[1] || 0;
    }
}

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
      bids_received: [],
      bids_received_loaded: false,
      bids_sent: [],
      bids_sent_loaded: false,
      messages: {},
      messages_loaded: false,
      messages_loading: false,
      notifications: [],
      notifications_loaded: false,
      edit_mode: false,
      updating: false,
      avatarFile: null,
      avatarPreview: null,
      avatarIsPortrait: false,
      avatarOriginalWidth: 1,
      avatarOriginalHeigth: 1
    };
  },
  componentWillMount: function(){
    var p = $.urlParam('p');
    if(p){
      if(["notification","wishlist","message","bids_received"].indexOf(p) >= 0){
        this.setState({rightPanel: p});
      }
      if(p == 'send_msg'){
        var u = $.urlParam('u');
        if(u != this.props.current_user_id) this.setState({rightPanel: 'showMessage', message_u_id: u});
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
  loadMessages: function () {
    console.log('loadMessages called');
    if(this.state.messages_loading){
      return;
    }
    console.log('loading...');
    this.setState({messages_loading: true});
    $.ajax({
      url: '/rest/users/' + this.props.user_id + '/messages.json',
      dataType: 'json',
      success: function (messages) {
        this.setState({
          messages: messages.reduce(function(messages, message) { messages[message.id] = message; return messages; }, {}),
          messages_loaded: true
        });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error('/rest/messages.json', status, err.toString());
      }.bind(this),
      complete: function () {
        this.setState({messages_loading: false});
      }.bind(this)
    });
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
    var user = this.state.user
    if(listings[id]){
      listings[id].is_closed = true;
      user.user_stat.total_active_listing -= 1;
    }
    this.setState({listings: listings, user: user});
  },
  _handleDeleteWishListItem: function(id){
    var items = this.state.wish_list_items;
    delete items[id]
    var user = this.state.user
    user.user_stat.total_wish_list_items -= 1;
    this.setState({wish_list_items: items, user: user});
  },
  _handleEdit: function(){
    this.setState({edit_mode: true});
  },
  _handleUpdate: function(){
    if(this.state.updating || !this.state.edit_mode){
      return;
    }
    this.setState({updating: true})
    
    var data = new FormData();

    if(this.state.avatarFile){
      data.append("image",this.state.avatarFile);

      var w = this.state.avatarOriginalWidth;
      var h = this.state.avatarOriginalHeigth;
      var m = Math.min(h,w);
      
      data.append("crop_x", (w/2 - m/2));
      data.append("crop_y", (h/2 - m/2));
      data.append("crop_w", m);
      data.append("crop_h", m);
    }

    data.append("first_name", this.state.user.first_name);
    data.append("last_name", this.state.user.last_name);
    if(this.state.user.primary_contact){
      data.append("phone", this.state.user.primary_contact.phone);
      data.append("email", this.state.user.primary_contact.email);
    }

    $.ajax({
      url: '/rest/users/' + this.props.user_id,
      type: "put",
      dataType: 'json',
      data: data,
      processData: false,
      contentType: false,
      success: function (user) {
        $.growl.notice({ title: '', message: "Хадгалагдлаа" , location: "br", delayOnHover: true});
        this.setState({edit_mode: false, user: user})
      }.bind(this),
      error: function (xhr, status, err) {
        console.error('/rest/listings', status, err.toString());
        $.growl.error({ title: '', message: "Алдаа гарлаа" , location: "br", delayOnHover: true});
      }.bind(this),
      complete: function () {
        this.setState({updating: false});
      }.bind(this)
    });
  },
  _handleUserInfoChange: function(attr, e){
    user = this.state.user
    if(attr == 'first_name' || attr == 'last_name'){
      user[attr] = e.target.value;
    }else if(attr == 'email' || attr == 'phone'){
      user.primary_contact = user.primary_contact || {}
      user.primary_contact[attr] = e.target.value;
    }
    this.setState({user: user});
  },
  _handleImageChange: function(e) {
    e.preventDefault();
    
    var reader = new FileReader();
    var file = e.target.files[0];
    var image = new Image();
    var err = false;
    reader.onload = function(_file) {
      image.src    = _file.target.result;              // url.createObjectURL(file);
      image.onload = function() {
        var w = image.width, h = image.height, s = file.size;
        if (w < 230 || h < 230 || s > 20*1024*1024){
          // TODO handle error...
          $.growl.error({ title: '', message: "Зургийн хэмжээ 230х230 пиксэлээс багагүй, файлын хэмжээ 20МВ-аас ихгүй байх хэрэгтэй" , location: "br", delayOnHover: true});
        }else{
          this.setState({
            avatarFile: file,
            avatarPreview: reader.result,
            avatarOriginalWidth: w,
            avatarOriginalHeigth: h,
            avatarIsPortrait: (h>w)
          });
        }
      }.bind(this);
      image.onerror= function() {
        err = true;
        // TODO handle error...
        console.log('Invalid file type: '+ file.type);
      };
    }.bind(this);

    reader.readAsDataURL(file);
  },
  _handleMessageClick: function(id){
    messages = this.state.messages;
    user = this.state.user  
    if(messages[id].unread){
      user.user_stat.total_unread_messages -= 1;
      messages[id].unread = false;
    }
    this.setState({rightPanel: 'showMessage', message_id: id, messages: messages, user: user});
  },
  _handleMessageUpdate: function(message){
    messages = this.state.messages
    if(message.id){
      if(messages[message.id]){
        console.log(messages[message.id]);
        console.log(message);
        messages[message.id].last_message = message.last_message
        messages[message.id].last_message_at = message.last_message_at
        messages[message.id].last_message_at_in_words = message.last_message_at_in_words
      }else{
        messages[message.id] = message
      }
      this.setState({messages: messages})
    }
  },
  _handleRefreshMessages: function(){
    this.setState({messages_loaded: false});
    this.loadMessages();
  },
  _handleMarkAllMessages: function(selected_ids,as_read){
    messages = this.state.messages;
    user = this.state.user;
    unread_diff = 0;
    selected_ids.forEach(function(id) {
      if(messages[id].unread && as_read){
        unread_diff -= 1;
      }else if(!messages[id].unread && !as_read){
        unread_diff += 1;
      }
      messages[id].unread = !as_read;
    });
    user.user_stat.total_unread_messages += unread_diff;
    this.setState({messages: messages, user: user});
  },
  _handleDeleteMessages: function(selected_ids){
    messages = this.state.messages;
    selected_ids.forEach(function(id) {
      delete messages[id];
    });
    this.setState({messages: messages});
  },
  render: function(){
    var right_panel;
    if(this.props.user_id != this.props.current_user_id || this.state.rightPanel == 'listing'){
      right_panel = <UserProfileListingsSection {...this.props} loadData={this.loadListings} loaded={this.state.listings_loaded} listings={this.state.listings} wish_list={this.state.wish_list} handleWishList={this._handleWishList} handleRevertWishList={this._handleRevertWishList} handleCloseListing={this._handleCloseListing}/>
    }else if(this.state.rightPanel == 'bids_received'){
      right_panel = <UserProfileBidsSection />
    }else if(this.state.rightPanel == 'bids_sent'){
      right_panel = <UserProfileBidsSection />
    }else if(this.state.rightPanel == 'wishlist'){
      right_panel = <UserProfileWishListSection loadData={this.loadWishListItems} loaded={this.state.wish_list_items_loaded} wish_list={this.state.wish_list_items} handleDeleteWishListItem={this._handleDeleteWishListItem}/>
    }else if(this.state.rightPanel == 'message'){
      right_panel = <UserProfileMessagesSection loadData={this.loadMessages} loaded={this.state.messages_loaded} messages={this.state.messages} handleClick={this._handleMessageClick} handleRefresh={this._handleRefreshMessages} handleMarkAll={this._handleMarkAllMessages} handleDelete={this._handleDeleteMessages} current_user_id={this.props.current_user_id} />
    }else if(this.state.rightPanel == 'notification'){
      right_panel = <UserProfileNotificationsSection />
    }else if(this.state.rightPanel == 'showMessage'){
      right_panel = <UserProfileMessageSenderSection current_user_id={this.props.current_user_id} message_id={this.state.message_id} message_u_id={this.state.message_u_id} handleMessageUpdate={this._handleMessageUpdate} />
    }
    return (
      <div className="main">
        <div className="container">
          {!this.state.edit_mode && <ProfileViewer handleRate={this._handleUserRate} rating={this.state.user_rating} current_user_id={this.props.current_user_id} user={this.state.user} loaded={this.state.user_loaded} rightPanel={this.state.rightPanel} handleRightPanelChange={this._handleRightPanelChange} handleEdit={this._handleEdit} />}
          {this.state.edit_mode && <ProfileEditor user={this.state.user} loaded={this.state.user_loaded} handleUpdate={this._handleUpdate} handleUserInfoChange={this._handleUserInfoChange} handleImageChange={this._handleImageChange} avatarPreview={this.state.avatarPreview} avatarIsPortrait={this.state.avatarIsPortrait} />}
          {right_panel}
        </div>
      </div>
    );
  }
})

var ProfileEditor = React.createClass({
  render: function(){
    var img, img_class;
    if(this.props.avatarPreview){
      img = <img src={this.props.avatarPreview} />
      if(this.props.avatarIsPortrait){
        img_class = "portrait"
      }
    }else{
      img = <img src={this.props.user.prof_pic_large ? this.props.user.prof_pic_large : '/images/no_avatar.png'} />
    }
    return (
      <div className="profile-left">
        <div className="profile-img-change">
          <div className="profile-img-change-title">Зураг солих</div>
          <input type="file" onChange={this.props.handleImageChange} />
        </div>
        <div className={"profile-img " + img_class}>
          {img}
        </div>
        <div className="col-md-12">
          <div className="form-group">
            <label htmlFor="lastName">Овог</label>
            <input id="lastName" type="text" className="form-control" onChange={this.props.handleUserInfoChange.bind(null,'last_name')} value={this.props.user.last_name} />
          </div>
          <div className="form-group">
            <label htmlFor="firstName">Нэр</label>
            <input id="firstName" type="text" className="form-control" onChange={this.props.handleUserInfoChange.bind(null,'first_name')} value={this.props.user.first_name}/>
          </div>
          <div className="form-group">
            <label htmlFor="phone">Утас</label>
            <input id="phone" type="text" className="form-control" onChange={this.props.handleUserInfoChange.bind(null,'phone')} value={this.props.user.primary_contact ? this.props.user.primary_contact.phone : ''} />
          </div>
          <div className="form-group">
            <label htmlFor="email">И-Мэйл <a href="#">[?]</a></label>
            <input id="email" type="text" className="form-control" onChange={this.props.handleUserInfoChange.bind(null,'email')} value={this.props.user.primary_contact ? this.props.user.primary_contact.email : ''} />
          </div>
          <div className="hairly-line" />
          <div className="text-center">
            {this.props.loaded && <div onClick={this.props.handleUpdate} className="btn btn-success" style={{width: '50%'}}>Хадгалах</div>}
          </div>
        </div>
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
            <li role="presentation" className={this.props.rightPanel == 'listing' ? 'active' :''}><a href="javascript:;" onClick={this.props.handleRightPanelChange.bind(null,'listing')}>Таны оруулсан тохиролцоо<span className="badge">{this.props.user.user_stat.total_listing > 0 && this.props.user.user_stat.total_listing}</span></a></li>
            <li role="presentation" className={this.props.rightPanel == 'bids_received' ? 'active' :''}><a href="javascript:;" onClick={this.props.handleRightPanelChange.bind(null,'bids_received')}>Ирсэн саналууд<span className="badge">{this.props.user.user_stat.total_bids_received > 0 && this.props.user.user_stat.total_bids_received}</span></a></li>
            <li role="presentation" className={this.props.rightPanel == 'bids_sent' ? 'active' :''}><a href="javascript:;" onClick={this.props.handleRightPanelChange.bind(null,'bids_sent')}>Илгээсэн саналууд<span className="badge">{this.props.user.user_stat.total_bids_sent > 0 && this.props.user.user_stat.total_bids_sent}</span></a></li>
            <li role="presentation" className={this.props.rightPanel == 'wishlist' ? 'active' :''}><a href="javascript:;" onClick={this.props.handleRightPanelChange.bind(null,'wishlist')}>Дугуйлсан тохиролцоо<span className="badge">{this.props.user.user_stat.total_wish_list_items > 0 && this.props.user.user_stat.total_wish_list_items}</span></a></li>
            <li role="presentation" className={(this.props.rightPanel == 'message' || this.props.rightPanel == 'showMessage') ? 'active' :''}><a href="javascript:;" onClick={this.props.handleRightPanelChange.bind(null,'message')}>Захиа<span className="badge">{this.props.user.user_stat.total_unread_messages > 0 && this.props.user.user_stat.total_unread_messages}</span></a></li>
            <li role="presentation" className={this.props.rightPanel == 'notification' ? 'active' :''}><a href="javascript:;" onClick={this.props.handleRightPanelChange.bind(null,'notification')}>Сонордуулга<span className="badge">{this.props.user.user_stat.total_unread_notifications > 0 && this.props.user.user_stat.total_unread_notifications}</span></a></li>
          </ul>
          <div className="hairly-line" />
        </div>
      );
    }

    return (
      <div className="profile-left">
        <div className="profile-img">
          <img src={this.props.user.prof_pic_large ? this.props.user.prof_pic_large : '/images/no_avatar.png'} />
        </div>
        <div className="profile-name">
          {this.props.user.full_name}
        </div>
        <div className="profile-rank">
          <div className="ranking-stars">
            {rater} <span>{(this.props.user.user_stat && this.props.user.user_stat.rating) ? ('(' + this.props.user.user_stat.rating + ')') : ''}</span>
          </div>
          <div className="full-detail-user-info-raters">{I18n.user_info.rating_count}: {this.props.user.user_stat ? this.props.user.user_stat.rating_count : ''}</div>
        </div>
        <div className="hairly-line" />
        {links}
        <div className="full-detail-user-info-deals">
          <div className="full-detail-user-info-deals-reg"><span className="glyphicon glyphicon-calendar"></span> {I18n.user_info.registered}: {this.props.user.registered_date}</div>
          <div className="full-detail-user-info-deals-all-deal"><span className="glyphicon glyphicon-tags"></span> {I18n.user_info.total_listing}: {this.props.user.user_stat ? this.props.user.user_stat.total_listing : ''}</div>
          <div className="full-detail-user-info-deals-active-deal"><span className="glyphicon glyphicon-tags"></span> {I18n.user_info.total_active_listing}: {this.props.user.user_stat ? this.props.user.user_stat.total_active_listing : ''}</div>
          <div className="full-detail-user-info-deals-done-deal"><span className="glyphicon glyphicon-ok"></span> {I18n.user_info.total_accepted_bid}: {this.props.user.user_stat ? this.props.user.user_stat.total_accepted_bid : ''}</div>
          <div className="full-detail-user-info-deals-phone"><span className="glyphicon glyphicon-phone"></span> {I18n.page.user_info.phone}: {this.props.user.primary_contact ? this.props.user.primary_contact.phone : ''}</div>
          <div className="full-detail-user-info-deals-email"><span className="glyphicon glyphicon-envelope"></span> {I18n.page.user_info.email}: {this.props.user.primary_contact ? this.props.user.primary_contact.email : ''}</div>
          <div className="hairly-line" />
          <div className="text-center">
            {this.props.user.id == this.props.current_user_id && <div onClick={this.props.handleEdit} className="btn btn-warning" style={{width: '50%'}}>{I18n.page.user_info.edit}</div>}
          </div>
        </div>
      </div>
    );
  }
})

module.exports = UserShowPage;