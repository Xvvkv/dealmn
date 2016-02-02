var OwnerInfo = require('./owner_info.jsx');
var ImageViewer = require('./image_viewer.jsx');
var Rater = require('react-rater');
var Rating = require('./fixed_star_rate.jsx');
var Linkify = require('react-linkify');

var BidShowPage = React.createClass({
  getInitialState: function() {
    return {
      bid: {},
      loaded: false,
      updating: false
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
  _handleBidAccept: function(e) {
    if(this.state.updating){
      console.log('not finished yet!!!')
      return;
    }
    if (confirm('Саналыг зөвшөөрсөнөөр таны оруулсан холбоо барих мэдээллийг санал өгсөн хүн харах боломжтой болно. Үргэлжлүүлэх үү?')) {
      this.setState({updating: true})

      $.ajax({
        url: '/rest/bids/' + this.props.bid_id + '/accept',
        type: "put",
        data: {},
        success: function (res) {
          bid = this.state.bid;
          bid.is_accepted = true;
          this.setState({bid: bid});
        }.bind(this),
        error: function (xhr, status, err) {
          console.error('/rest/bids/accept', status, err.toString());
          $.growl.error({ title: '', message: "Алдаа гарлаа" , location: "br", delayOnHover: true});
        }.bind(this),
        complete: function () {
          this.setState({updating: false});
        }.bind(this)
      });
    } else {
      return;
    }
  },
  _handleCloseListing: function(e) {
    if(this.state.updating){
      console.log('not finished yet!!!')
      return;
    }
    if (confirm('Тохиролцоог хааснаар санал хүлээж авах болон буцааж нээх боломжгүй болно. Үргэлжлүүлэх үү?')) {
      this.setState({updating: true})

      $.ajax({
        url: '/rest/listings/' + this.state.bid.biddable.id + '.json',
        type: "delete",
        dataType: 'json',
        success: function () {
          $.growl.notice({ title: '', message: "Тохиролцоо хаагдлаа" , location: "br", delayOnHover: true});
          var bid = this.state.bid;
          bid.biddable.is_closed = true;
          this.setState({bid: bid});
        }.bind(this),
        error: function (xhr, status, err) {
          $.growl.error({ title: '', message: "Алдаа гарлаа" , location: "br", delayOnHover: true});
          console.error('/rest/listings.json', status, err.toString());
        }.bind(this),
        complete: function () {
          this.setState({updating: false})
        }.bind(this)
      });
    } else {
      return;
    }
  },
  _handleDeleteBid: function(e) {
    if(this.state.updating){
      console.log('not finished yet!!!')
      return;
    }
    if (confirm('Саналыг устгаснаар тохиролцоо оруулсан хүн энэхүү саналыг тань зөвшөөрөх боломжгүй болно. Үргэлжлүүлэх үү?')) {
      this.setState({updating: true})

      $.ajax({
        url: '/rest/bids/' + this.state.bid.id + '.json',
        dataType: 'json',
        type: "delete",
        success: function () {
          window.location = '/listings/' + this.state.bid.biddable.id;
        }.bind(this),
        error: function (xhr, status, err) {
          $.growl.error({ title: '', message: "Алдаа гарлаа" , location: "br", delayOnHover: true});
          console.error('/rest/bids.json', status, err.toString());
        }.bind(this),
        complete: function () {
          this.setState({updating: false})
        }.bind(this)
      });
    } else {
      return;
    }
  },
  render: function() {
    return (
      <div className="main">
        <div className="container">
          <div className="deal-full-detail-page-container">
            <BidDetail bid={this.state.bid} loaded={this.state.loaded} current_user_id={this.props.current_user_id} handleBidAccept={this._handleBidAccept} handleCloseListing={this._handleCloseListing} handleDeleteBid={this._handleDeleteBid} />
          </div>
          <div className="main-right">
            <OwnerInfo handleRate={this._handleUserRate} rating={this.state.user_rating} user={this.state.bid.user || {}} loaded={this.state.loaded} current_user_id={this.props.current_user_id} title={I18n.page.user_info.title} />
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
  getInitialState: function() {
    return {
      just_accepted: false
    };
  },
  handleBidAccept: function(e) {
    this.setState({just_accepted: true});
    this.props.handleBidAccept(e);
  },
  render: function() {
    var header_info, delete_button, edit_button;

    if(this.props.loaded){
      if(this.props.bid.user.id == this.props.current_user_id){
        if(this.props.bid.is_accepted){
          header_info = (
            <div className="bs-callout bs-callout-info" id="callout-helper-context-color-specificity">
              <h5>Таны оруулсан доорхи тохиролцоонд илгээсэн энэхүү саналыг хүлээн авсан байна.</h5>
              <p><strong><a href={"/listings/"+this.props.bid.biddable.id}>{this.props.bid.biddable.title}</a></strong></p>
              <address>
                <strong>Холбоо барих</strong><br />
                Утас: {this.props.bid.biddable.contact ? this.props.bid.biddable.contact.phone : 'N\\A'}<br />
                И-Мэйл хаяг: {this.props.bid.biddable.contact ? this.props.bid.biddable.contact.email : 'N\\A'}<br />
              </address>
            </div>
          );
        }else{
          header_info = (
            <div className="bs-callout bs-callout-info" id="callout-helper-context-color-specificity">
              <h5>Та доорхи тохиролцоонд энэхүү саналыг илгээсэн байна.</h5>
              <p><strong><a href={"/listings/"+this.props.bid.biddable.id}>{this.props.bid.biddable.title}</a></strong></p>
            </div>
          );
          edit_button = <a className="btn btn-warning" href={'/bids/' + this.props.bid.id + '/edit'}><span className="glyphicon glyphicon-edit" /></a>
          delete_button = <a className="btn btn-danger" href="javascript:;" onClick={this.props.handleDeleteBid}><span className="glyphicon glyphicon-remove" /></a>
        }
      }else if(this.props.bid.biddable.user_id == this.props.current_user_id){
        if(this.props.bid.is_accepted){
          header_info = (
            <div className="bs-callout bs-callout-info" id="callout-helper-context-color-specificity">
              {!this.props.bid.biddable.is_closed && <button onClick={this.props.handleCloseListing} className="btn btn-danger header-info-button">Тохиролцоог хаах</button>}
              {!this.state.just_accepted && <h5>Та доорхи тохиролцоонд ирсэн энэхүү саналыг хүлээн авсан байна.</h5>}
              {this.state.just_accepted && <h5>Та энэхүү саналыг хүлээн авлаа.</h5>}
              <p><strong><a href={"/listings/"+this.props.bid.biddable.id}>{this.props.bid.biddable.title}</a></strong></p>
              <address>
                <strong>Холбоо барих</strong><br />
                Утас: {this.props.bid.contact ? this.props.bid.contact.phone : 'N\\A'}<br />
                И-Мэйл хаяг: {this.props.bid.contact ? this.props.bid.contact.email : 'N\\A'}<br />
              </address>
            </div>
          );
        }else{
          header_info = (
            <div className="bs-callout bs-callout-info" id="callout-helper-context-color-specificity">
              {!this.props.bid.biddable.is_closed && <button onClick={this.handleBidAccept} className="btn btn-primary header-info-button"><span className="glyphicon glyphicon-ok" style={{marginRight: 3}}></span> Зөвшөөрөх</button>}
              <h5>Таны оруулсан доорхи тохиролцоонд энэхүү саналыг илгээсэн байна.</h5>
              <p><strong><a href={"/listings/"+this.props.bid.biddable.id}>{this.props.bid.biddable.title}</a></strong></p>
            </div>
          );
        }
      }else{
        header_info = (
          <div className="bs-callout bs-callout-info" id="callout-helper-context-color-specificity">
            <h5>Санал ирсэн тохиролцоо.</h5>
            <p><strong><a href={"/listings/"+this.props.bid.biddable.id}>{this.props.bid.biddable.title}</a></strong></p>
          </div>
        );
      }
    }
    return (
      <div className="deal-full-detail-page">
        {header_info}
        <ImageViewer images={this.props.bid.images}/>
        <div className="full-detail-short-info">
          <div className="full-detail-title">{this.props.bid.title}</div>
          <div className="full-detail-short-information">
            <div className="hairly-line" />
            <div className="full-detail-short-description">
              <strong style={{fontSize: 14}}>Тайлбар: <br/></strong>
              <Linkify>{this.props.bid.description}</Linkify>
            </div>
            <div className="hairly-line" />
            <div className="full-detail-deal-buttons">
              <div>
                {delete_button}
                {edit_button}
              </div>
            </div>
          </div>
          <div className="clearfix" />
        </div>
        <div className="clearfix" />
      </div>
    );
  }
});

module.exports = BidShowPage;