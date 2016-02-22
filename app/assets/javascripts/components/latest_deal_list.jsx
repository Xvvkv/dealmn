var LatestDealItem = React.createClass({
  render: function() {
    return (
      <div className="item-list-item">
        <div className="item-list-item-img">
          <img src={this.props.bid.biddable.images && this.props.bid.biddable.images.length > 0 ? this.props.bid.biddable.images[0].thumb : '/images/no_image.jpg'} />
        </div>
        <div className="title-1"><a href={'/listings/' + this.props.bid.biddable.id}>{this.props.bid.biddable.title}</a></div>
        <div className="info-1"><a href={'/users/' + this.props.bid.biddable.user_id}>{this.props.bid.biddable.user_name}</a>, <a href={'/users/'+this.props.bid.user.id}>{this.props.bid.user.display_name}</a> хэрэглэгч нарын хооронд тохиролцоо хийгдлээ</div>
        <div className="clearfix"></div>
      </div>
    );
  }
});

var LatestDealList = React.createClass({
  getInitialState: function() {
    return {
      bids: [],
      loaded: false
    };
  },
  componentDidMount: function() {
    this.loadDataFromServer();
  },
  loadDataFromServer: function () {
    $.ajax({
      url: '/rest/bids/latest_deals.json?limit=10',
      dataType: 'json',
      success: function (bids) {
        this.setState({
          bids: bids,
          loaded: true
        });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error('/rest/latest_deals.json', status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    var content;
    if(this.state.loaded){
      content = this.state.bids.map(function(bid,index) {
        return (
          <LatestDealItem bid={bid} key={index} />
        );
      })
    }else{
      content = <div className="loader"><img src='/images/loader.gif' /> <div>Уншиж байна ...</div></div>
    }
    return (
      <div className="item-list-items">
        <div className="home-module-title">Сүүлд хийгдсэн тохиролцоо</div>
        <div style={{maxHeight: 400, overflowY: 'auto', paddingTop: 5}}>
          {content}
        </div>
      </div>
    );
  }
});

module.exports = LatestDealList;

      