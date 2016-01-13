var HeaderProfile = React.createClass({
  getInitialState: function() {
    return {
      current_user: {}
    };
  },
  componentDidMount: function() {
    this.loadDataFromServer();
  },
  loadDataFromServer: function () {
    if (this.props.current_user_id){
      $.ajax({
        url: '/rest/users/' + this.props.current_user_id + '.json',
        dataType: 'json',
        success: function (current_user) {
          this.setState({
            current_user: current_user,
          });
        }.bind(this),
        error: function (xhr, status, err) {
          console.error('/rest/users.json', status, err.toString());
        }.bind(this)
      });
    }
  },
  render: function() {
    var section;
    if (this.props.current_user_id){
      section = <HeaderUserProfile user={this.state.current_user} />
    }else{
      section = <HeaderLogin />
    }
    return (
      <div className="header-profile">
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
          <a href='/login'><div className="btn btn-default">Нэвтрэх</div></a>
        </div>
      </div>
    );
  }
});

var HeaderUserProfile = React.createClass({
  render: function() {
    return (
      <div>
        <div className="header-profile-img"><img src={this.props.user.prof_pic ? this.props.user.prof_pic : '/images/no_avatar.png'} /></div>
        <div className="header-profile-info">
          <div className="header-profile-name">        
            <div className="dropdown">
              <button className="btn btn-default dropdown-toggle" id="dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                {this.props.user.full_name} <span className="caret" />
              </button>
              <ul className="dropdown-menu" aria-labelledby="dropdown">
                <li><a href="#">Action</a></li>
                <li><a href="#">Another action</a></li>
                <li><a href="#">Something else here</a></li>
                <li role="separator" className="divider" />
                <li><a href="/logout" data-method="delete" rel="nofollow">Logout</a></li>
              </ul>
            </div>
          </div>
          <div className="header-profile-notification">
            <div className="header-profile-chat"><img src='/images/header-chat-icon.png' /> 1</div>
            <div className="header-profile-all-deals"><img src='/images/deals-icon.png' /> 5</div>
            <div className="header-profile-all-deals"><img src='/images/check.png' /> 5</div>
          </div>
        </div>
      </div>
    );
  }
});


module.exports = HeaderProfile;
