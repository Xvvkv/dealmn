var UserProfileBidsItem = React.createClass({
  getInitialState: function() {
    return {
      deleting: false
    };
  },
  _handleDeleteBid: function(e) {
    if(this.state.deleting){
      console.log('not finished yet!!!')
      return;
    }
    if (confirm('Саналыг устгаснаар тохиролцоо оруулсан хүн энэхүү саналыг тань зөвшөөрөх боломжгүй болно. Үргэлжлүүлэх үү?')) {
      this.setState({deleting: true})

      $.ajax({
        url: '/rest/bids/' + this.props.bid.id + '.json',
        dataType: 'json',
        type: "delete",
        success: function () {
          this.props.handleDeleteBid(this.props.bid.id)
        }.bind(this),
        error: function (xhr, status, err) {
          $.growl.error({ title: '', message: "Алдаа гарлаа" , location: "br", delayOnHover: true});
          console.error('/rest/bids.json', status, err.toString());
        }.bind(this),
        complete: function () {
          this.setState({deleting: false})
        }.bind(this)
      });
    } else {
      return;
    }
  },
  render: function(){
    var edit_button, delete_button;
    if(this.props.is_sent_bid && !this.props.bid.is_accepted){
      edit_button = <a data-tooltip="Саналыг засах" className="btn btn-warning" href={'/bids/' + this.props.bid.id + '/edit'}><span className="glyphicon glyphicon-edit" /></a>
      delete_button = <a data-tooltip="Саналыг устгах" className="btn btn-danger" href="javascript:;" onClick={this._handleDeleteBid}><span className="glyphicon glyphicon-remove" /></a> 
    }
    return (
      <div className="full-detail-bid-item">
        {this.props.bid.is_accepted && <div className="badget accepted-badget" />}
        <div className="full-detail-deal-item-name">
          <div><a href={'/listings/' + this.props.bid.biddable.id}>{this.props.bid.biddable.title}</a></div>
          <span> тохиролцоонд {this.props.is_sent_bid ? 'илгээсэн' : 'ирсэн'} санал.</span>
        </div>
        <div className="full-detail-bid-item-detail-img">
          <img src={this.props.bid.images && this.props.bid.images.length > 0 ? this.props.bid.images[0].url : '/images/no_image_large.jpg'} />
        </div>
        <div className="full-detail-bid-item-detail">
          <div className="full-detail-bid-item-detail-title"><a href={'/bids/'+this.props.bid.id}>{this.props.bid.title}</a></div>
          {!this.props.is_sent_bid && <div className="full-detail-bid-user"><a href={'/users/'+this.props.bid.user_id}>{this.props.bid.user_name}</a></div>}
          <div className="full-detaul-bid-item-detail-description">
            {this.props.bid.description}
          </div>
          <div className="profile-user-deals-buttons">
            {delete_button}
            {edit_button}
          </div>
        </div>
      </div>
    );
  }
})

var UserProfileBidsSection = React.createClass({
  componentDidMount: function() {
    if(!this.props.loaded){
      this.props.loadData();
    }
  },
  render: function(){
    var panel;
    if(this.props.loaded){
      var bids = Object.keys(this.props.bids).sort(function(a, b){return b-a}).map(function(id,index) {
        return (
          <UserProfileBidsItem key={index} bid={this.props.bids[id]} current_user_id={this.props.current_user_id} handleDeleteBid={this.props.handleDeleteBid} is_sent_bid={this.props.is_sent_bid} />
        );
      }.bind(this));

      panel = (
        <div>
          {bids.length == 0 && <div className="alert alert-info" role="alert">{this.props.is_sent_bid ? 'Илгээсэн' : 'Ирсэн'} санал байхгүй байна.</div>}
          {bids}
        </div>
      );
    }else{
      panel = <div className="page-loader" />
    }
    return (
        <div className="profile-right">
          <div className="home-module-title big-title">{this.props.is_sent_bid ? 'Илгээсэн' : 'Ирсэн'} саналууд </div>
          {panel}
        </div>
      );
  }
})

module.exports = UserProfileBidsSection