var StarRating = require('react-star-rating');

var ListingItem = React.createClass({
  render: function() {
    return (
      <div className="timeline-content">
        <ListingItemUserInfo user={this.props.listing.user} />
        <div className="timeline-cyrcle"></div>
        <div className="timeline-deal-item">
          <div className="timeline-arrow"></div>
          <div className="timeline-deal-item-container">
            <div className="timeline-deal-item-detail">
              <div className="timeline-deal-item-img"><img src='/images/123.jpg' /></div>
              <div className="timeline-deal-item-title">Iphone 6S 128gb factory unlocked</div>
              <div className="timeline-deal-item-info">
                It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.  It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. 
              </div>
              <div className="timeline-deal-item-want">
                <span>Тохиролцоно:</span> <a href="#">Samsung Galaxy S6</a>, <a href="#">Samsung Galaxy S6</a>
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
                <div className="btn btn-default"  data-toggle="collapse" data-target="#collapseExample12" aria-expanded="false" aria-controls="collapseExample12">
                  Ирсэн санал: 5
                </div>
              </div>
              <div className="timeline-deal-item-bottom-bid">
                <div className="btn btn-primary">
                  Санал илгээх
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
          <div className="collapse" id="collapseExample12">
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
        <div className="timeline-dealer-rank-star"></div>
        <div className="timeline-dealer-rank-vote">Үнэлсэн: 15</div>
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
                  <td><span>Үнэлгээ</span> <br/> <img src='/images/rank-big.png' /> </td>
                  <td align="right">
                    <span>Нийт үнэлсэн</span> <br/> 
                    <div className="count-rank-people">15</div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span>Нийт тохиролцоо</span> <br/> 
                    <div className="count-all-deals">15</div>
                  </td>
                  <td align="right">
                    <span>Тохиролцсон</span> <br/> 
                    <div className="count-done-deals">15</div>
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

module.exports = ListingItem;