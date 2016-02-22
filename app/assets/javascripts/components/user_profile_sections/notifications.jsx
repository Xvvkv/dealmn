var UserProfileNotificationItem = React.createClass({
  render: function(){
    var className = "profile-all-notification-item"
    if(this.props.item.unseen){
      className += " notification-unread";
    }
    var avatar = '/images/no_avatar.png';
    var name;
    if(this.props.item.sender){
      if(this.props.item.sender.prof_pic){
        avatar = this.props.item.sender.prof_pic;
      }
      name = <strong>{this.props.item.sender.name}</strong>;
    }else{
      avatar = '/images/logo-mini.jpg' // System Avatar
    }
    return (
      <a href={this.props.item.url}>
        <div className={className}>
          <div className="notification-content-img"><img src={avatar} /></div>
          <div className="notification-content-text">
            {name} {this.props.item.message}
          </div>
          <div className="notification-content-date">{this.props.item.created_at_in_words}</div>
          <div className="clearfix" />
        </div>
      </a>
    );
  }
});

var UserProfileNotificationsSection = React.createClass({
  componentDidMount: function() {
    if(!this.props.loaded){
      this.props.loadData();
    }
  },
  render: function(){
    var panel;
    if(this.props.loaded){
      panel = (
        <div>
          {this.props.notifications.length == 0 && <div className="alert alert-info" role="alert">Танд сонордуулга байхгүй байна.</div>}
          <div className="profile-all-notification">
            {this.props.notifications.map(function(notification,index) {
              return (
                <UserProfileNotificationItem key={index} item={notification} />
              );
            })}
          </div>
        </div>
      );
    }else{
      panel = <div className="page-loader" />
    }
    return (
      <div className="profile-right">
        <div className="home-module-title big-title">Сонордуулга</div>
        {panel}
      </div>
    );
  }
})

module.exports = UserProfileNotificationsSection



