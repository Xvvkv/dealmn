var OwnerInfo = require('./owner_info.jsx');
var ImageViewer = require('./image_viewer.jsx');
var Rater = require('react-rater');
var Rating = require('./fixed_star_rate.jsx');

var BidShowPage = React.createClass({
  getInitialState: function() {
    return {
      bid: {},
      loaded: false
    };
  },
  componentDidMount: function() {
    this.loadDataFromServer();
  },
  loadDataFromServer: function () {
    $.ajax({
      url: '/rest/bids/' + this.props.bid_id + '.json',
      dataType: 'json',
      success: function (bid) {
        this.setState({
          bid: bid,
          user_rating: bid.user.user_stat.current_user_rating,
          loaded: true
        });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error('/rest/bids.json', status, err.toString());
      }.bind(this)
    });
  },
  _handleUserRate: function(rating, last_rating) {
    if(this.state.loaded && this.state.bid.user.id != this.props.current_user_id){
      $.ajax({
        url: '/rest/user_ratings',
        type: "post",
        dataType: 'json',
        data: {rating: rating, id: this.state.bid.user.id},
        success: function (rating) {
          b_updated = this.state.bid
          b_updated.user.user_stat.rating = +((b_updated.user.user_stat.rating_sum + rating.rating) / (b_updated.user.user_stat.rating_count + 1)).toFixed(1)
          b_updated.user.user_stat.rating_count += 1
          this.setState({
            user_rating: rating.rating,
            bid: b_updated
          });
        }.bind(this),
        error: function (xhr, status, err) {
          console.error('/rest/user_ratings', status, err.toString());
          $.growl.error({ title: '', message: "Алдаа гарлаа" , location: "br", delayOnHover: true});
        }.bind(this)
      });
    }
  },
  render: function() {
    return (
      <div className="main">
        <div className="container">
          <div className="deal-full-detail-page-container">
            <BidDetail bid={this.state.bid}/>
          </div>
          <div className="main-right">
            <OwnerInfo handleRate={this._handleUserRate} rating={this.state.user_rating} user={this.state.bid.user || {}} loaded={this.state.loaded} current_user_id={this.props.current_user_id} />
            <div className="right-banner">
              <a href="#"><img src='/images/bobby_banner.jpg' /></a>
            </div>
          </div>
        </div>
      </div>
    );
  }
});


var BidDetail = React.createClass({
  render: function() {
    var biddable_info
    if(this.props.bid.biddable){
      biddable_info = (
        <div className="bs-callout bs-callout-info" id="callout-helper-context-color-specificity">
          <div className="btn btn-primary bid-accept-button"><span className="glyphicon glyphicon-ok" style={{marginRight: 3}} /> Зөвшөөрөх</div>
          <h5>Таны оруулсан доорх тохиролцоонд санал ирсэн байна.</h5>
          <p><strong><a href={"/listings/"+this.props.bid.biddable.id}>{this.props.bid.biddable.title}</a></strong></p>
        </div>
      );
    }
    return (
      <div className="deal-full-detail-page">
        {biddable_info}
        <ImageViewer images={this.props.bid.images}/>
        <div className="full-detail-short-info">
          <div className="full-detail-title">{this.props.bid.title}</div>
          <div className="full-detail-short-information">
            <div className="hairly-line" />
            <div className="full-detail-short-description-intro">
              <strong style={{fontSize: 14}}>Тайлбар: <br/></strong>
              {this.props.bid.description}
            </div>
            <div className="hairly-line" />
          </div>
          <div className="clearfix" />
        </div>
        <div className="clearfix" />
      </div>
    );
  }
});

module.exports = BidShowPage;