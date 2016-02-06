var OwnerInfo = require('./../owner_info.jsx');

var UserProfileMessageItem = React.createClass({
  render: function(){
    return (
      <div className="message-to">
        <div className="message-to-conversation">
          <div className="message-to-text">
            {this.props.message_text.message_text}
            <div className="message-to-date">
              {this.props.message_text.created_at_in_words}
            </div>
          </div>
          <div className="clearfix"></div>
        </div>
        <div className="clearfix"></div>
      </div>
    );
  }
});

var UserProfileMessageParticipantItem = React.createClass({
  render: function(){
    return (
      <div className="message-from">
        <div className="message-from-conversation">
          <div className="message-from-user"><img src={this.props.user.prof_pic ? this.props.user.prof_pic : '/images/no_avatar.png'} /></div>
          <div className="message-from-text">
            {this.props.message_text.message_text}
            <div className="message-from-date">
              {this.props.message_text.created_at_in_words}
            </div>
          </div>
          <div className="clearfix"></div>
        </div>
        <div className="clearfix"></div>
      </div>
    );
  }
});

var UserProfileMessageSenderSection = React.createClass({
  getInitialState: function() {
    return {
      message: {},
      loaded: false,
      new_message: '',
      sending: false
    };
  },
  componentDidMount: function() {
    if(this.props.message_id){
      this.loadMessageFromMessageId();
    }else{
      this.loadMessageFromUserId();
    }
  },
  loadMessageFromUserId: function() {
    $.ajax({
      url: '/rest/users/' + this.props.current_user_id + '/messages/0.json?message_u_id=' + this.props.message_u_id,
      dataType: 'json',
      success: function (message) {
        this.setState({
          message: message,
          user_rating: message.participant.user_stat.current_user_rating,
          loaded: true
        });
        this.props.handleMessageUpdate(message)
      }.bind(this),
      error: function (xhr, status, err) {
        console.error('/rest/messages.json', status, err.toString());
      }.bind(this)
    });
  },
  loadMessageFromMessageId: function () {
    $.ajax({
      url: '/rest/users/' + this.props.current_user_id + '/messages/' + this.props.message_id + '.json',
      dataType: 'json',
      success: function (message) {
        this.setState({
          message: message,
          user_rating: message.participant.user_stat.current_user_rating,
          loaded: true
        });
        this.props.handleMessageUpdate(message)
      }.bind(this),
      error: function (xhr, status, err) {
        console.error('/rest/messages.json', status, err.toString());
      }.bind(this)
    });
  },
  _handleUserRate: function(rating, last_rating) {
    if(this.state.loaded){
      $.ajax({
        url: '/rest/user_ratings',
        type: "post",
        dataType: 'json',
        data: {rating: rating, id: this.state.message.participant.id},
        success: function (rating) {
          message = this.state.message
          message.participant.user_stat.rating = +((message.participant.user_stat.rating_sum + rating.rating) / (message.participant.user_stat.rating_count + 1)).toFixed(1)
          message.participant.user_stat.rating_count += 1
          this.setState({
            user_rating: rating.rating,
            message: message
          });
        }.bind(this),
        error: function (xhr, status, err) {
          console.error('/rest/user_ratings', status, err.toString());
          $.growl.error({ title: '', message: "Алдаа гарлаа" , location: "br", delayOnHover: true});
        }.bind(this)
      });
    }
  },
  handleChange: function(e) {
    field = e.target.name;
    this.setState({field: e.target.value});
  },
  handleSend: function() {
    if(this.state.new_message && this.state.new_message.length > 0){
      if(this.state.sending){
        console.log('not finished yet!!!')
        return;
      }

      this.setState({sending: true})

      $.ajax({
        url: '/rest/users/' + this.props.current_user_id + '/messages',
        type: "post",
        dataType: 'json',
        data: {text: this.state.new_message, participant_id: this.state.message.participant.id},
        success: function (message) {
          this.setState({
            message: message,
            new_message: ''
          });
          this.props.handleMessageUpdate(message)
        }.bind(this),
        error: function (xhr, status, err) {
          console.error('/rest/messages', status, err.toString());
          $.growl.error({ title: '', message: "Алдаа гарлаа" , location: "br", delayOnHover: true});
        }.bind(this),
        complete: function () {
          this.setState({sending: false});
        }.bind(this)
      });
    }
  },
  render: function(){
    var panel;
    if(this.state.loaded){
      var items = [];
      this.state.message.message_texts.forEach(function(message_text) {
        if((this.state.message.is_cur_user_initiator && message_text.direction == 0) || (!this.state.message.is_cur_user_initiator && message_text.direction == 1)){
          items.push(<UserProfileMessageItem key={message_text.id} message_text={message_text} />);
        }else{
          items.push(<UserProfileMessageParticipantItem key={message_text.id} message_text={message_text} user={this.state.message.participant} />);
        }
      }.bind(this));
      panel = (
        <div className="profile-right">
          <div className="home-module-title big-title">Захиа</div>
          <div className="profile-user-messages-conversation">
            {items}
          </div>
          <div className="chat-right">
            <OwnerInfo handleRate={this._handleUserRate} rating={this.state.user_rating} current_user_id={this.props.current_user_id} user={this.state.message.participant} loaded={this.state.loaded} exclude_pm_button={true} />
            <img src='/images/361banner.jpg' />
          </div>
          <div className="message-send-input">
            <textarea name='new_message' className="form-control" rows="3" value={this.state.new_message} onChange={this.handleChange} />
            <button onClick={this.handleSend} className="btn btn-primary pull-right">Илгээх</button>
          </div>
          <div className="clearfix"></div>
        </div>
      );
    }else{
      panel = <div>loader</div>
    }
    return panel;
  }
})

module.exports = UserProfileMessageSenderSection