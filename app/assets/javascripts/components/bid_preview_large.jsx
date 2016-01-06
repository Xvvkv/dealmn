var BidPreviewLarge = React.createClass({
  render: function() {
    return (
      <div>
        {this.props.bids.map(function(bid,index) {
          return (
            <BidPreviewLargeItem key={index} bid={bid} />
          );
        })}
      </div>
    );
  }
});

var BidPreviewLargeItem = React.createClass({
  render: function() {
    return (
      <div className="full-detail-bid-item">
        <div className="full-detail-bid-item-detail-img">
          <img src={this.props.bid.images && this.props.bid.images.length > 0 ? this.props.bid.images[0].url : '/images/123.jpg'} />
        </div>
        <div className="full-detail-bid-item-detail">
          <div className="full-detail-bid-item-detail-title"><a href={"/bids/" + this.props.bid.id}>{this.props.bid.title}</a></div>
          <div className="full-detail-bid-user"><a href="#">{this.props.bid.bidder_name}</a></div>
          <div className="full-detaul-bid-item-detail-description">
            {this.props.bid.description}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = BidPreviewLarge;