ClickOutside = require ('./mixins/click-outside.js')

var HeaderProfile = React.createClass({
  mixins: [ClickOutside],
  getInitialState: function() {
    return {
      current_user: {},
      user_loaded: false,
      selectedPanel: null
    };
  },
  componentDidMount: function() {
    this.loadDataFromServer();
    this.setOnClickOutside('mainDiv', this.onClickOutside);
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
      user.user_stat.total_unread_notifications = 0;
      this.setState({current_user: user});
    }

    if(this.state.selectedPanel == panel){
      this.setState({selectedPanel: null});
    }else{
      this.setState({selectedPanel: panel});
    }
  },
  render: function() {
    var section;
    if (this.props.current_user_id){
      section = <HeaderUserProfile user={this.state.current_user} selectedPanel={this.state.selectedPanel} handlePanelChange={this._handlePanelChange} loaded={this.state.user_loaded} />
    }else{
      section = <HeaderLogin />
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
          {this.props.messages.map(function(message,index) {
            return (
              <div key={index} className={message.unread ? "notification-dropdown-content notification-unread" : "notification-dropdown-content"}>
                <a href={'/users/' + this.props.user.id + '?p=send_msg&u=' + message.participant_hash.id}>
                  <div className="notification-content-img"><img src={message.participant_hash.prof_pic ? message.participant_hash.prof_pic : '/images/no_avatar.png'} /></div>
                  <div className="notification-content-text">
                    <strong>{message.participant_hash.full_name}</strong><br/>
                    {message.last_message}
                    <div className="notification-content-date">{message.last_message_at_in_words}</div>
                  </div>
                </a>
                <div className="clearfix"></div>
              </div>
            );
          }.bind(this))}
        </div>
      );
    }else{
      panel = <div className="loader">Уншиж байна ...</div>
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
  render: function() {
    <div />
  }
});

var HeaderUserProfileWishListPanel = React.createClass({
  render: function() {
    <div />
  }
});


var HeaderUserProfile = React.createClass({
  getInitialState: function() {
    return {
      wish_list_items: [],
      wish_list_items_loaded: false,
      messages: {},
      messages_loaded: false,
      messages_loading: false,
      notifications: [],
      notifications_loaded: false
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
  render: function() {
    var panel;
    if(this.props.selectedPanel == 'wishlist'){
      panel = (
        <div className="notification-dropdown-container wishlist-panel">
          <div className="notification-dropdown-header">Дугуйлсан тохиролцоо</div>
          <div className="notification-dropdown-content notification-unread">
            <div className="notification-content-img"><img src='/images/no_avatar.png' /></div>
            <div className="notification-content-text">
              <strong>Хүүкү Батка</strong> таньд илгээсэн <strong>Iphone 6 FU SpaceGray</strong> саналаа устгасан байна.
            </div>
            <div className="notification-content-date">2 цагийн өмнө</div>
            <div className="clearfix"></div>
          </div>
          <div className="notification-dropdown-content">
            <div className="notification-content-img"><img src='/images/no_avatar.png' /></div>
            <div className="notification-content-text">
              <strong>Хүүкү Батка</strong><br/> Хайртай шүү чамдаа. Алийшүү сда миньАлийшүү сда миньАлийшүү сда миньАлийшүү сда миньАлийшүү сда миньАлийшүү сда миньАлийшүү сда миньАлийшүү сда миньАлийшүү сда миньАлийшүү сда миньАлийшүү сда миньАлийшүү сда миньАлийшүү сда миньАлийшүү сда миньАлийшүү сда миньАлийшүү сда миньАлийшүү сда миньАлийшүү сда миньАлийшүү сда минь
            </div>
            
            <div className="clearfix"></div>
          </div>
          <div className="notification-dropdown-content notification-unread">
            <div className="notification-content-img"><img src='/images/no_avatar.png' /></div>
            <div className="notification-content-text">
              <strong>Хүүкү Батка</strong> таньд илгээсэн <strong>Iphone 6 FU SpaceGray</strong> саналаа устгасан байна.
            </div>
            <div className="notification-content-date">2 цагийн өмнө</div>
            <div className="clearfix"></div>
          </div>
          <div className="notification-dropdown-content">
            <div className="notification-content-img"><img src='/images/no_avatar.png' /></div>
            <div className="notification-content-text">
              <strong>Хүүкү Батка</strong> таньд илгээсэн <strong>Iphone 6 FU SpaceGray</strong> саналаа устгасан байна.
            </div>
            <div className="notification-content-date">2 цагийн өмнө</div>
            <div className="clearfix"></div>
          </div>
          <div className="notification-dropdown-content">
            <div className="notification-content-img"><img src='/images/no_avatar.png' /></div>
            <div className="notification-content-text">
              <strong>Хүүкү Батка</strong> таньд илгээсэн <strong>Iphone 6 FU SpaceGray</strong> саналаа устгасан байна.
            </div>
            <div className="notification-content-date">2 цагийн өмнө</div>
            <div className="clearfix"></div>
          </div>
          <div className="notification-dropdown-footer"><a href="#">Бүгдийг харах</a></div>
        </div>
      );
    }else if(this.props.selectedPanel == 'message'){
      panel = <HeaderUserProfileMessagePanel loadData={this.loadMessages} loaded={this.state.messages_loaded} messages={this.state.messages} user={this.props.user} />
    }else if(this.props.selectedPanel == 'notification'){
      panel = (
        <div className="notification-dropdown-container notification-panel">
          <div className="notification-dropdown-header">Сонордуулга</div>
          <div className="loader">Уншиж байна ...</div>
          <div className="notification-dropdown-footer"><a href="#">Бүгдийг харах</a></div>
        </div>
      );
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
            <div onClick={this.props.handlePanelChange.bind(null,'notification')} className={this.props.loaded && this.props.user.user_stat.total_unread_notifications > 0 ? "header-notification notification-active" : "header-notification"}>
              {this.props.loaded && this.props.user.user_stat.total_unread_notifications > 0 && <div className="header-notification-number">{this.props.user.user_stat.total_unread_notifications}</div>}
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
              <li role="separator" className="divider"></li>
              <li><a href="/logout" data-method="delete" rel="nofollow">Гарах</a></li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
});


module.exports = HeaderProfile;
