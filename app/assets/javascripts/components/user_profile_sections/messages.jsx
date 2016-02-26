//TODO Pagination
//var Paginate = require('react-paginate-component');

var UserProfileMessagesItem = React.createClass({
  handleClick: function(id,e){
    this.props.handleClick(id);
  },
  render: function(){
    return (
      <tr className={this.props.message.unread ? "unread-message" : "read-message"}>
        <td><label><input type="checkbox" onChange={this.props.handleSelect.bind(null,this.props.message.id,this.props.is_selected)} checked={this.props.is_selected} /></label></td>
        <td onClick={this.handleClick.bind(null,this.props.message.id)}>{this.props.message.participant_hash.full_name}</td>
        <td onClick={this.handleClick.bind(null,this.props.message.id)}><div className='title-1'><span className="message-intro">{this.props.message.last_message}</span></div></td>
        <td onClick={this.handleClick.bind(null,this.props.message.id)}>{this.props.message.last_message_at_in_words}</td>
      </tr>
    );
  }
});

var UserProfileMessagesSection = React.createClass({
  getInitialState: function() {
    return {
      selected_ids: [],
    };
  },
  componentDidMount: function() {
    if(!this.props.loaded){
      this.props.loadData();
    }
  },
  _handleSelect: function(id, old_status) {
    var selected_ids = this.state.selected_ids;
    var index = selected_ids.indexOf(id);
    if(old_status){
      if (index > -1) {
        selected_ids.splice(index, 1);
      }
    }else{
      if (index == -1) {
        selected_ids.push(id);
      }
    }
    this.setState({selected_ids: selected_ids});
  },
  _handleSelectAll: function(){
    var selected_ids = this.state.selected_ids;
    if(selected_ids.length == Object.keys(this.props.messages).length){
      this.setState({selected_ids: []});
    }else{
      this.setState({selected_ids: Object.keys(this.props.messages).map(Number)});
    }
  },
  _handleMarkAll: function(as_read){
    var selected_ids = this.state.selected_ids;
    $.ajax({
      url: '/rest/users/' + this.props.current_user_id + '/messages/mark',
      type: "post",
      data: {selected_ids: selected_ids, as_read: (as_read ? 1 : 0)},
      success: function (res) {
        this.props.handleMarkAll(selected_ids,as_read);
      }.bind(this),
      error: function (xhr, status, err) {
        console.error('/rest/messages/mark', status, err.toString());
        $.growl.error({ title: '', message: "Алдаа гарлаа" , location: "br", delayOnHover: true});
      }.bind(this)
    });
  },
  _handleDelete: function(){
    var selected_ids = this.state.selected_ids;
    $.ajax({
      url: '/rest/users/' + this.props.current_user_id + '/messages/delete_selected',
      type: "delete",
      data: {selected_ids: selected_ids},
      success: function (res) {
        this.props.handleDelete(selected_ids);
      }.bind(this),
      error: function (xhr, status, err) {
        console.error('/rest/messages/delete_selected', status, err.toString());
        $.growl.error({ title: '', message: "Алдаа гарлаа" , location: "br", delayOnHover: true});
      }.bind(this)
    });
  },
  render: function(){
    var panel;
    if(this.props.loaded){
      var messages = [];
      for (var key in this.props.messages) messages.push(this.props.messages[key]);
      messages.sort(function(a, b) {return new Date(b.last_message_at) - new Date(a.last_message_at)});
      messages = messages.map(function(message,index) {
        return (
          <UserProfileMessagesItem key={index} message={message} handleClick={this.props.handleClick} handleSelect={this._handleSelect} is_selected={this.state.selected_ids.indexOf(message.id) > -1} />
        );
      }.bind(this));


      panel = (
        <div>
          {messages.length == 0 && <div className="alert alert-info" role="alert">Таньд захидал байхгүй байна.</div>}
          <div className="profile-user-messages">
            <table className="table">
              <tbody>
                {messages}
              </tbody>
            </table>
          </div>
        </div>
      );
    }else{
      panel = <div className="page-loader" />
    }
    return (
        <div className="profile-right">
          <div className="home-module-title big-title">Захиа</div>
          <div className="profile-message-control">
            <div className="btn-group" role="group" aria-label="...">
              <button onClick={this.props.handleRefresh} className="btn btn-default"><span className="glyphicon glyphicon-refresh"></span></button>
              <button onClick={this._handleSelectAll} className="btn btn-default"><span className="glyphicon glyphicon-check"></span></button>
              <button onClick={this._handleDelete} className="btn btn-default"><span className="glyphicon glyphicon-trash"></span></button>
              <div className="btn-group" role="group">
                <button className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <span className="glyphicon glyphicon-cog"></span>{"\u00a0"}
                  <span className="caret"></span>
                </button>
                <ul className="dropdown-menu">
                  <li><a onClick={this._handleMarkAll.bind(null,true)} href="javascript:;">Уншсан болгож тэмдэглэх</a></li>
                  <li><a onClick={this._handleMarkAll.bind(null,false)} href="javascript:;">Уншаагүй болгож тэмдэглэх</a></li>
                </ul>
              </div>
            </div>
          </div>
          {panel}
        </div>
      );
  }
})

module.exports = UserProfileMessagesSection