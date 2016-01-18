//TODO Pagination
//var Paginate = require('react-paginate-component');

var UserProfileMessagesItem = React.createClass({
  render: function(){
    return (
      <tr className={this.props.message.unseen ? "unread-message" : "read-message"}>
        <td><label><input type="checkbox" /></label></td>
        <td>{this.props.message.name}</td>
        <td><span className="message-intro">{this.props.message.last_message}</span></td>
        <td>{this.props.message.last_message_at}</td>
      </tr>
    );
  }
});

var UserProfileMessagesSection = React.createClass({
  componentDidMount: function() {
    if(!this.props.loaded){
      this.props.loadData();
    }
  },
  render: function(){
    var panel;
    if(this.props.loaded){
      panel = (
        <div className="profile-right">
          <div className="home-module-title big-title">Захиа</div>
          <div className="profile-message-control">
            <div className="btn-group" role="group" aria-label="...">
              <button className="btn btn-default"><span className="glyphicon glyphicon-trash"></span></button>
              <button className="btn btn-default"><span className="glyphicon glyphicon-check"></span></button>
              <div className="btn-group" role="group">
                <button className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <span className="glyphicon glyphicon-cog"></span>{"\u00a0"}
                  <span className="caret"></span>
                </button>
                <ul className="dropdown-menu">
                  <li><a href="#">Уншсан болгож тэмдэглэх</a></li>
                  <li><a href="#">Уншаагүй болгож тэмдэглэх</a></li>
                </ul>
              </div>
            </div>
          </div>
          {this.props.messages.length == 0 && <div className="alert alert-info" role="alert">Таньд захидал байхгүй байна.</div>}
          <div className="profile-user-messages">
            <table className="table">
              <tbody>
                {this.props.messages.map(function(message,index) {
                  return (
                    <UserProfileMessagesItem key={index} message={message} />
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      );
    }else{
      panel = <div>loader</div>
    }
    return panel;
  }
})

module.exports = UserProfileMessagesSection