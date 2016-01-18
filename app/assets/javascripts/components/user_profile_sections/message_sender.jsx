var UserProfileMessageSenderItem = React.createClass({
  render: function(){
    return (
      <div>TODO</div>
    );
  }
});

var UserProfileMessageSenderSection = React.createClass({
  render: function(){
    var panel;
    if(this.props.loaded){
      panel = (
        <div>TODO</div>
      );
    }else{
      panel = <div>loader</div>
    }
    return panel;
  }
})

module.exports = UserProfileMessageSenderSection