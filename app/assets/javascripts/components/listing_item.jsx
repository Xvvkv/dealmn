var Rating = require('./fixed_star_rate.jsx');

var ListingItem = React.createClass({
  render: function() {
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
              <div className="timeline-deal-item-title">{this.props.listing.title} - {this.props.listing.id}</div>
              <div className="timeline-deal-item-info">{this.props.listing.text_description}</div>
              <div className="timeline-deal-item-want">
                <span>Тохиролцоно:</span> {this.props.listing.wanted_description}
              </div>
              <div className="clearfix"></div>
            </div>
            <div className="timeline-deal-item-bottom">
              <div className="timeline-deal-item-bottom-check">
                <div className="checkbox btn btn-default">
                  <label>
                  <input type="checkbox" /> Дугуйлах
                  </label>
                </div>
              </div>
              <div className="timeline-deal-item-bottom-bids">
                <div className="btn btn-default"  data-toggle="collapse" data-target={'#bid_prev_' + this.props.listing.id} aria-expanded="false" aria-controls="collapseExample12">
                  Ирсэн санал: 5
                </div>
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
          <BidPreview id={'bid_prev_' + this.props.listing.id}/>
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
        <div className="timeline-dealer-img"><img src={this.props.user.prof_pic ? this.props.user.prof_pic : '/images/profile_sample.png'} /></div>
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
        <div className="timeline-dealer-info-img"><img src={this.props.user.prof_pic ? this.props.user.prof_pic : '/images/profile_sample.png'} /></div>
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
  render: function() {
    return (
      <div className="collapse" id={this.props.id}>
        <div className="well timeline-deal-item-bids-items">
          <div className="timeline-deal-item-bids-left-arrow"></div>
          <div className="timeline-deal-item-bids-item">
            <a href="#"><img src='/images/123.jpg' /></a>
          </div>
          <div className="timeline-deal-item-bids-item">
            <a href="#"><img src='/images/123.jpg' /></a>
          </div>
          <div className="timeline-deal-item-bids-item">
            <a href="#"><img src='/images/123.jpg' /></a>
          </div>
          <div className="timeline-deal-item-bids-item">
            <a href="#"><img src='/images/123.jpg' /></a>
          </div>
          <div className="timeline-deal-item-bids-right-arrow"></div>
          <div className="clearfix"></div>
        </div>
      </div>
    );
  }
});

module.exports = ListingItem;