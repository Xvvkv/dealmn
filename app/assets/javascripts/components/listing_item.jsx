var Rating = require('./fixed_star_rate.jsx');
var BidPreview = require('./bid_preview.jsx');
var WishListButton = require('./wish_list_button.jsx');
var ListingItemButtons = require('./listing_item_buttons.jsx');

var ListingItem = React.createClass({
  getInitialState: function() {
    return {
      is_closed: false // removing listing from array of listings based on id was little bit risky when user clicks multiple close button, so instead of removing it'll just mark it as closed & render emtpy div
    };
  },
  initAls: function() {
    this.refs.bid_preview.initAls();
  },
  handleCloseListing: function(e) {
    this.setState({is_closed: true});
  },
  render: function() {
    if (this.state.is_closed){
      return <div style={{display: 'none'}} />;
    }
    var wish_list_button;
    if(this.props.wish_listed != null){
      wish_list_button = <WishListButton {...this.props} />;
    }

    var bid_prev, bid_prev_button;
    if(this.props.listing.bids && this.props.listing.bids.length > 0){
      bid_prev_button = (
        <div className="timeline-deal-item-bottom-bids-button btn btn-default" onClick={this.initAls}  data-toggle="collapse" data-target={'#bid_prev_' + this.props.listing.id} aria-expanded="false" aria-controls="collapseExample12">
          Ирсэн санал: {this.props.listing.bids.length}
        </div>
      );

      bid_prev = <BidPreview ref="bid_preview" id={'bid_prev_' + this.props.listing.id} additionalClass="collapse" bids={this.props.listing.bids} />
    }else{
      bid_prev_button = (
        <div className="timeline-deal-item-bottom-bids-button btn btn-default">
          Ирсэн санал: 0
        </div>
      );
    }
    var listing_item_buttons = <ListingItemButtons current_user_id={this.props.current_user_id} listing={this.props.listing} handleCloseListing={this.handleCloseListing} />
    return (
      <div className="timeline-content">
        <ListingItemUserInfo user={this.props.listing.user} />
        <div className="timeline-cyrcle"></div>
        <div className="timeline-deal-item">
          <div className="timeline-arrow"></div>
          {this.props.listing.is_free && <div className="timeline-badget free-badget"></div>}
          <div className="timeline-deal-item-container">
            <div className="timeline-deal-item-detail">
              <div className="timeline-deal-item-img"><img src={this.props.listing.images && this.props.listing.images.length > 0 ? this.props.listing.images[0].thumb : '/images/123.jpg'} /></div>
              <div className="timeline-deal-item-title"><a href={'/listings/' + this.props.listing.id}>{this.props.listing.title}</a></div>
              <div className="timeline-deal-item-date">2015-12-11 21:34:12</div>
              <div className="timeline-deal-item-info">{this.props.listing.text_description}</div>
              <div className="timeline-deal-item-want">
                <span>Тохиролцоно:</span> {this.props.listing.wanted_description}
              </div>
              <div className="clearfix"></div>
            </div>
            <div className="timeline-deal-item-bottom-buttons">
              <div style={{float: 'left'}}>
                {wish_list_button}
                {bid_prev_button}
              </div>
              <div>
                {listing_item_buttons}
              </div>
            </div>
            <div className="clearfix" />
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
        <div className="timeline-dealer-name"><a href={'/users/' + this.props.user.id}>{this.props.user.display_name}</a></div>
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
          <div className="timeline-dealer-info-name"><a href={'/users/' + this.props.user.id}>{this.props.user.display_name}</a></div>
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

module.exports = ListingItem;