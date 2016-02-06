ClickOutside = require ('./mixins/click-outside.js')
var PubSub = require('pubsub-js');

var HeaderProfile = React.createClass({
  mixins: [ClickOutside],
  getInitialState: function() {
    return {
      current_user: {},
      user_loaded: false,
      selectedPanel: null,
      wish_list_items: [],
      total_wish_list_items: 0,
      wish_list_items_loaded: false,
      wish_list_items_loading: false
    };
  },
  componentDidMount: function() {
    this.loadDataFromServer();
    this.setOnClickOutside('mainDiv', this.onClickOutside);
    PubSub.subscribe('wishlist_created', this._handleWishListCreatedEvent);
    PubSub.subscribe('messages_seen', this._handleMessagesSeenEvent);
    PubSub.subscribe('notifications_seen', this._handleNotificationsSeenEvent);
  },
  componentWillUnmount: function() {
    PubSub.unsubscribe('wishlist_created');
    PubSub.unsubscribe('messages_seen');
    PubSub.unsubscribe('notifications_seen');
  },
  loadDataFromServer: function () {
    if (this.props.current_user_id){
      $.ajax({
        url: '/rest/users/' + this.props.current_user_id + '.json',
        dataType: 'json',
        success: function (current_user) {
          this.setState({
            current_user: current_user,
            user_loaded: true
          });
        }.bind(this),
        error: function (xhr, status, err) {
          console.error('/rest/users.json', status, err.toString());
        }.bind(this)
      });
    }else {
      this.loadWishList();
    }
  },
  onClickOutside: function () {
    this.setState({selectedPanel: null});
  },
  _handlePanelChange: function(panel) {

    if(panel == 'message'){
      user = this.state.current_user;
      user.user_stat.total_unseen_messages = 0;
      this.setState({current_user: user});
    }else if(panel == 'notification'){
      user = this.state.current_user;
      user.user_stat.total_unseen_notifications = 0;
      this.setState({current_user: user});
    }

    if(this.state.selectedPanel == panel){
      this.setState({selectedPanel: null});
    }else{
      this.setState({selectedPanel: panel});
    }
  },
  loadWishList: function() {
    console.log('loadWishList called');
    if(this.state.wish_list_items_loading){
      return;
    }
    console.log('loading...');
    this.setState({wish_list_items_loading: true});
    $.ajax({
      url: '/rest/wish_lists.json?include_detail=1&limit=5',
      dataType: 'json',
      success: function (res) {
        if (this.props.current_user_id){
          this.setState({
            wish_list_items: res,
            wish_list_items_loaded: true
          });
        }else{
          this.setState({
            wish_list_items: res.items,
            wish_list_items_loaded: true,
            total_wish_list_items: res.meta.total
          });
        }
      }.bind(this),
      error: function (xhr, status, err) {
        console.error('/rest/wishlist.json', status, err.toString());
      }.bind(this),
      complete: function () {
        this.setState({wish_list_items_loading: false});
      }.bind(this)
    });
  },
  _handleWishListCreatedEvent: function(msg, wl) {
    if(this.state.wish_list_items_loaded){
      wish_list_items = this.state.wish_list_items;
      wish_list_items.unshift(wl);
      total_wish_list_items = this.state.total_wish_list_items;
      total_wish_list_items +=1;
      this.setState({wish_list_items: wish_list_items.slice(0,5), total_wish_list_items: total_wish_list_items})
    }
    if(this.state.user_loaded){
      current_user = this.state.current_user;
      current_user.user_stat.total_wish_list_items += 1;
      this.setState({current_user: current_user});
    }
  },
  _handleMessagesSeenEvent: function () {
    user = this.state.current_user;
    user.user_stat.total_unseen_messages = 0;
    this.setState({current_user: user});
  },
  _handleNotificationsSeenEvent: function () {
    user = this.state.current_user;
    user.user_stat.total_unseen_notifications = 0;
    this.setState({current_user: user});
  },
  render: function() {
    var section;
    if (this.props.current_user_id){
      section = <HeaderUserProfile user={this.state.current_user} selectedPanel={this.state.selectedPanel} handlePanelChange={this._handlePanelChange} loaded={this.state.user_loaded} wish_list_items={this.state.wish_list_items} loadWishList={this.loadWishList} wish_list_items_loaded={this.state.wish_list_items_loaded} />
    }else{
      section = <HeaderLogin selectedPanel={this.state.selectedPanel} handlePanelChange={this._handlePanelChange} wish_list_items={this.state.wish_list_items} loadWishList={this.loadWishList} wish_list_items_loaded={this.state.wish_list_items_loaded} total_wish_list_items={this.state.total_wish_list_items} />
    }
    return (
      <div ref="mainDiv" className="header-profile">
        {section}
      </div>
    );
  }
});


var HeaderLogin = React.createClass({
  render: function() {
    var panel;
    if(this.props.selectedPanel == 'wishlist'){
      panel = <HeaderUserProfileWishListPanel loadData={this.props.loadWishList} loaded={this.props.wish_list_items_loaded} wishlist={this.props.wish_list_items} />
    }
    return (
      <div className="header-login">
        <div className="header-login-social-media">
          <a href="#"><img src='/images/fb-login.png' /></a>
          <a href="#"><img src='/images/tw-login.png' /></a>
          <a href="#"><img src='/images/gp-login.png' /></a>
        </div>
        <div className="header-profile-info">   
          <a href="/login"><div className="btn btn-default">Нэвтрэх</div></a>
        </div>
        <div onClick={this.props.handlePanelChange.bind(null,'wishlist')} className={this.props.wish_list_items_loaded && this.props.total_wish_list_items > 0 ? "header-notification notification-active" : "header-notification"}>
          {this.props.wish_list_items_loaded && this.props.total_wish_list_items > 0 && <div className="header-notification-number">{this.props.total_wish_list_items}</div>}
          <span className="glyphicon glyphicon-ok-circle"></span>
        </div>
        {panel}
      </div>
    );
  }
});


var HeaderUserProfileMessagePanel = React.createClass({
  componentDidMount: function() {
    if(!this.props.loaded){
      this.props.loadData();
    }
  },
  render: function() {
    var panel;
    if(this.props.loaded){
      panel = (
        <div>
          {this.props.messages.length == 0 && <div className="no-content-info">Танд захидал байхгүй байна</div>}
          {this.props.messages.map(function(message,index) {
            return (
              <a key={index} href={'/users/' + this.props.user.id + '?p=send_msg&u=' + message.participant_hash.id}>
                <div className={message.unread ? "notification-dropdown-content notification-unread" : "notification-dropdown-content"}>
                  <div className="notification-content-img"><img src={message.participant_hash.prof_pic ? message.participant_hash.prof_pic : '/images/no_avatar.png'} /></div>
                  <div className="notification-content-text">
                    <strong>{message.participant_hash.full_name}</strong><br/>
                    {message.last_message}
                    <div className="notification-content-date">{message.last_message_at_in_words}</div>
                  </div>
                  <div className="clearfix"></div>
                </div>
              </a>
            );
          }.bind(this))}
        </div>
      );
    }else{
      panel = <div className="loader"><img src='/images/loader.gif' /> <div>Уншиж байна ...</div></div>
    }
    return (
      <div className="notification-dropdown-container message-panel">
        <div className="notification-dropdown-header">Захиа</div>
        {panel}
        <div className="notification-dropdown-footer"><a href={'/users/' + this.props.user.id + '?p=message'}>Бүгдийг харах</a></div>
      </div>
    );
  }
});

var HeaderUserProfileNotificationPanel = React.createClass({
  componentDidMount: function() {
    if(!this.props.loaded){
      this.props.loadData();
    }
  },
  render: function() {
    var panel;
    if(this.props.loaded){
      panel = (
        <div>
          {this.props.notifications.length == 0 && <div className="no-content-info">Танд сонордуулга байхгүй байна</div>}
          {this.props.notifications.map(function(notification,index) {
            var avatar = '/images/no_avatar.png';
            var name;
            if(notification.sender){
              if(notification.sender.prof_pic){
                avatar = notification.sender.prof_pic;
              }
              name = <strong>{notification.sender.name}</strong>;
            }else{
              avatar = '/images/no_avatar.png' // System Avatar
            }
            return (
              <a key={index} href={notification.url}>
                <div className={notification.unseen ? "notification-dropdown-content notification-unread" : "notification-dropdown-content"}>
                  <div className="notification-content-img"><img src={avatar} /></div>
                  <div className="notification-content-text">
                    {name} {notification.message}
                    <div className="notification-content-date">{notification.created_at_in_words}</div>
                  </div>
                  <div className="clearfix"></div>
                </div>
              </a>
            );
          }.bind(this))}
        </div>
      );
    }else{
      panel = <div className="loader"><img src='/images/loader.gif' /> <div>Уншиж байна ...</div></div>
    }
    return (
      <div className="notification-dropdown-container notification-panel">
        <div className="notification-dropdown-header">Сонордуулга</div>
        {panel}
        <div className="notification-dropdown-footer"><a href={'/users/' + this.props.user.id + '?p=notification'}>Бүгдийг харах</a></div>
      </div>
    );
  }
});

var HeaderUserProfileWishListPanel = React.createClass({
  componentDidMount: function() {
    if(!this.props.loaded){
      this.props.loadData();
    }
  },
  render: function() {
    var panel;
    if(this.props.loaded){
      panel = (
        <div>
          {this.props.wishlist.length == 0 && <div className="no-content-info">Дугуйлсан тохиролцоо байхгүй байна.</div>}
          {this.props.wishlist.map(function(item,index) {
            return (
              <a key={index} href={'/listings/' + item.listing.id}>
                <div className={item.listing.is_closed ? "notification-dropdown-content notification-closed" : "notification-dropdown-content"}>
                  <div className="notification-content-img"><img src={item.listing.image ? item.listing.image.thumb : '/images/no_image.jpg'} /></div>
                  <div className="notification-content-text">
                    <strong>{item.listing.title}</strong><br/>
                    {item.listing.text_description}
                  </div>                
                  <div className="clearfix"></div>
                </div>
              </a>
            );
          }.bind(this))}
        </div>
      );
    }else{
      panel = <div className="loader"><img src='/images/loader.gif' /> <div>Уншиж байна ...</div></div>
    }
    var link_url;
    if(this.props.user){
      link_url = '/users/' + this.props.user.id + '?p=wishlist';
    }else{
      link_url = '/wish_lists'
    }
    return (
      <div className={this.props.user ? "notification-dropdown-container wishlist-panel" : "notification-dropdown-container notification-panel"}>
        <div className="notification-dropdown-header">Дугуйлсан тохиролцоо</div>
        {panel}
        <div className="notification-dropdown-footer"><a href={link_url}>Бүгдийг харах</a></div>
      </div>
    );
  }
});


var HeaderUserProfile = React.createClass({
  getInitialState: function() {
    return {
      messages: {},
      messages_loaded: false,
      messages_loading: false,
      notifications: [],
      notifications_loaded: false,
      notifications_loading: false
    };
  },
  loadMessages: function () {
    console.log('loadMessages called');
    if(this.state.messages_loading){
      return;
    }
    console.log('loading...');
    this.setState({messages_loading: true});
    $.ajax({
      url: '/rest/users/' + this.props.user.id + '/messages.json?limit=5',
      dataType: 'json',
      success: function (messages) {
        this.setState({
          messages: messages,
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
  loadNotifications: function () {
    console.log('loadNotifications called');
    if(this.state.notifications_loading){
      return;
    }
    console.log('loading...');
    this.setState({notifications_loading: true});
    $.ajax({
      url: '/rest/users/' + this.props.user.id + '/notifications.json?limit=5',
      dataType: 'json',
      success: function (notifications) {
        this.setState({
          notifications: notifications,
          notifications_loaded: true
        });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error('/rest/notifications.json', status, err.toString());
      }.bind(this),
      complete: function () {
        this.setState({notifications_loading: false});
      }.bind(this)
    });
  },
  render: function() {
    var panel;
    if(this.props.selectedPanel == 'wishlist'){
      panel = <HeaderUserProfileWishListPanel loadData={this.props.loadWishList} loaded={this.props.wish_list_items_loaded} wishlist={this.props.wish_list_items} user={this.props.user} />
    }else if(this.props.selectedPanel == 'message'){
      panel = <HeaderUserProfileMessagePanel loadData={this.loadMessages} loaded={this.state.messages_loaded} messages={this.state.messages} user={this.props.user} />
    }else if(this.props.selectedPanel == 'notification'){
      panel = <HeaderUserProfileNotificationPanel loadData={this.loadNotifications} loaded={this.state.notifications_loaded} notifications={this.state.notifications} user={this.props.user} />
    }
    return (
      <div className="header-profile-logged">
        <div className="header-profile-notifications">
            <div onClick={this.props.handlePanelChange.bind(null,'wishlist')} className={this.props.loaded && this.props.user.user_stat.total_wish_list_items > 0 ? "header-notification notification-active" : "header-notification"}>
              {this.props.loaded && this.props.user.user_stat.total_wish_list_items > 0 && <div className="header-notification-number">{this.props.user.user_stat.total_wish_list_items}</div>}
              <span className="glyphicon glyphicon-ok-circle"></span>
            </div>
            <div onClick={this.props.handlePanelChange.bind(null,'message')} className={this.props.loaded && this.props.user.user_stat.total_unseen_messages > 0 ? "header-notification notification-active" : "header-notification"}>
              {this.props.loaded && this.props.user.user_stat.total_unseen_messages > 0 && <div className="header-notification-number">{this.props.user.user_stat.total_unseen_messages}</div>}
              <span className="glyphicon glyphicon-envelope"></span>
            </div>
            <div onClick={this.props.handlePanelChange.bind(null,'notification')} className={this.props.loaded && this.props.user.user_stat.total_unseen_notifications > 0 ? "header-notification notification-active" : "header-notification"}>
              {this.props.loaded && this.props.user.user_stat.total_unseen_notifications > 0 && <div className="header-notification-number">{this.props.user.user_stat.total_unseen_notifications}</div>}
              <span className="glyphicon glyphicon-list"></span>
            </div>
          {panel}
        </div>
        <div className="header-profile-info">
          <div className="dropdown">
            <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
            {this.props.user.display_name} <span className="caret"></span>
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
              <li><a href={'/users/' + this.props.user.id}>Хувийн булан</a></li>
              <li><a href={'/users/' + this.props.user.id + '?p=bids_received'}>Ирсэн саналууд</a></li>
              <li><a href={'/users/' + this.props.user.id + '?p=bids_sent'}>Илгээсэн саналууд</a></li>
              <li role="separator" className="divider"></li>
              <li><a href='/edit'>Нууц үг солих </a></li>
              <li><a href="/logout" data-method="delete" rel="nofollow">Гарах</a></li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
});


module.exports = HeaderProfile;
