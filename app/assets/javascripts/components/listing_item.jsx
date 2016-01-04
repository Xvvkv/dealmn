var Rating = require('./fixed_star_rate.jsx');

var ListingItem = React.createClass({
  initAls: function() {
    this.refs.bid_preview.initAls();
  },
  render: function() {
    var wish_list_button;
    if(!this.props.wish_listed){
      wish_list_button = (
        <div className="checkbox btn btn-default">
          <label>
            <input onClick={this.props.handleWishListClick.bind(null,this.props.listing.id)} type="checkbox" /> Дугуйлах
          </label>
        </div>
      );
    }

    var bid_prev, bid_prev_button;
    if(this.props.listing.bids && this.props.listing.bids.length > 0){
      bid_prev_button = (
        <div className="btn btn-default" onClick={this.initAls}  data-toggle="collapse" data-target={'#bid_prev_' + this.props.listing.id} aria-expanded="false" aria-controls="collapseExample12">
          Ирсэн санал: {this.props.listing.bids.length}
        </div>
      );
      bid_prev = <BidPreview ref="bid_preview" id={'bid_prev_' + this.props.listing.id} bids={this.props.listing.bids} />
    }else{
      bid_prev_button = (
        <div className="btn btn-default">
          Ирсэн санал: 0
        </div>
      );
    }
    return (
      <div className="timeline-content">
        <ListingItemUserInfo user={this.props.listing.user} />
        <div className="timeline-cyrcle"></div>
        <div className="timeline-deal-item">
          <div className="timeline-arrow"></div>
          {this.props.listing.is_free && <div className="timeline-badget free-badget"></div>}
          <div className="timeline-deal-item-container">
            <div className="timeline-deal-item-detail">
              <div className="timeline-deal-item-img">{this.props.listing.images && this.props.listing.images.length > 0 ? <img src={this.props.listing.images[0].url}/> : <img src='/images/123.jpg' />}</div>
              <div className="timeline-deal-item-title"><a href={'/listings/' + this.props.listing.id}>{this.props.listing.title}</a></div>
              <div className="timeline-deal-item-info">{this.props.listing.text_description}</div>
              <div className="timeline-deal-item-want">
                <span>Тохиролцоно:</span> {this.props.listing.wanted_description}
              </div>
              <div className="clearfix"></div>
            </div>
            <div className="timeline-deal-item-bottom">
              <div className="timeline-deal-item-bottom-check">
                {wish_list_button}
              </div>
              <div className="timeline-deal-item-bottom-bids">
                {bid_prev_button}
              </div>
              <div className="timeline-deal-item-bottom-bid">
                <div className="btn btn-primary">
                  <a href={'/listings/' + this.props.listing.id + '/bids/new'}>Санал илгээх</a>
                </div>
              </div>
              <div className="timeline-deal-item-bottom-chat">
                <div className="btn btn-success">
                  Чатлах
                </div>
              </div>
              <div className="clearfix"></div>
            </div>
          </div>
          {bid_prev}
        </div>
        <div className="clearfix"></div>
      </div>
    );
  }
});

var ListingItemUserInfo = React.createClass({
  render: function() {
    return (
      <div className="timeline-dealer-info hover">
        <div className="timeline-dealer-img"><img src={this.props.user.prof_pic ? this.props.user.prof_pic : '/images/no_avatar.png'} /></div>
        <div className="timeline-dealer-name">{this.props.user.display_name}</div>
        <div className="timeline-dealer-rank-star"><Rating rating={Math.round(this.props.user.user_stat.rating)}/></div>
        <div className="timeline-dealer-rank-vote">Үнэлсэн: {this.props.user.user_stat.rating_count}</div>
        <ListingItemUserInfoTooltip user={this.props.user} />
      </div>
    );
  }
});

var ListingItemUserInfoTooltip = React.createClass({
  render: function() {
    return (
      <div className="tooltip timeline-user-info-tooltip">
        <div className="timeline-dealer-info-img"><img src={this.props.user.prof_pic ? this.props.user.prof_pic : '/images/no_avatar.png'} /></div>
        <div className="timeline-dealer-info-other">
          <div className="timeline-dealer-info-name"><a href="#">{this.props.user.display_name}</a></div>
          <div className="timeline-dealer-info-rank">
            <table width="100%">
              <tbody>
                <tr>
                  <td><span>Үнэлгээ</span> <br/> <Rating rating={Math.round(this.props.user.user_stat.rating)}/> </td>
                  <td align="right">
                    <span>Нийт үнэлсэн</span> <br/> 
                    <div className="count-rank-people">{this.props.user.user_stat.rating_count}</div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span>Нийт тохиролцоо</span> <br/> 
                    <div className="count-all-deals">{this.props.user.user_stat.total_listing}</div>
                  </td>
                  <td align="right">
                    <span>Тохиролцсон</span> <br/> 
                    <div className="count-done-deals">{this.props.user.user_stat.total_accepted_bid}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
});

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
  render: function() {
    return (
      <div className="collapse als-container" id={this.props.id} ref="als">
        <div className="well timeline-deal-item-bids-items">
        <span className="als-prev"><div className="timeline-deal-item-bids-left-arrow"></div></span>
        <div className="als-viewport">
          <ul className="als-wrapper">
            {this.props.bids.map(function(bid,index) {
              return (
                <li key={index} className="als-item timeline-deal-item-bids-item">
                  <a href="#">
                    {bid.images && bid.images.length > 0 ? <img src={bid.images[0].url}/> : <img src='/images/123.jpg' />}
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

module.exports = ListingItem;