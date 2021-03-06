var BidPreview = React.createClass({
  getInitialState: function() {
    return {
      als_initiated: false
    };
  },
  initAls: function() {
    if(this.state.als_initiated){
      return;
    }

    $(this.refs.als).als({
      visible_items: Math.min(this.props.bids.length,5),
      speed: 200
    });

    this.setState({
      als_initiated: true
    });
  },
  componentDidMount: function(){
    if(this.props.initAlsOnMount){
      this.initAls();
    }
  },
  render: function() {
    return (
      <div className={"als-container " + (this.props.additionalClass ? this.props.additionalClass : '')} id={this.props.id} ref="als">
        <div className="well timeline-deal-item-bids-items">
        <span className="als-prev"><div className="timeline-deal-item-bids-left-arrow"></div></span>
        <div className="als-viewport">
          <ul className="als-wrapper">
            {this.props.bids.map(function(bid,index) {
              return (
                <li key={index} className="als-item timeline-deal-item-bids-item">
                  <a className={bid.is_accepted ? "accepted-bid-item-little hover" : "hover"} href={"/bids/" + bid.id}>
                    {bid.is_accepted && <span className="glyphicon glyphicon-ok-sign glyphicon-background"><span className="inner" /></span>}
                    {bid.images && bid.images.length > 0 ? <img src={bid.images[0].thumb}/> : <img src='/images/no_image.jpg' />}
                    <div className="tooltip text-tooltip">{bid.title}</div>
                  </a>
                </li>
              );
            })}
            
          </ul>
        </div>
        <span className="als-next"><div className="timeline-deal-item-bids-right-arrow"></div></span>
        </div>
      </div>
    );
  }
});

module.exports = BidPreview;