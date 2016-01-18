var Breadcrumb = require('./breadcrumb.jsx');
var OwnerInfo = require('./owner_info.jsx');
var ImageViewer = require('./image_viewer.jsx');
var Rater = require('react-rater');
var Rating = require('./fixed_star_rate.jsx');
var BidPreview = require('./bid_preview.jsx');
var BidPreviewLarge = require('./bid_preview_large.jsx');
var WishListButton = require('./wish_list_button.jsx');
var ListingItemButtons = require('./listing_item_buttons.jsx');

var ListingShowPage = React.createClass({
  getInitialState: function() {
    return {
      listing: {},
      loaded: false,
      is_closed: false
    };
  },
  componentDidMount: function() {
    this.loadDataFromServer();
  },
  loadDataFromServer: function () {
    $.ajax({
      url: '/rest/listings/' + this.props.listing_id + '.json',
      dataType: 'json',
      success: function (listing) {
        this.setState({
          listing: listing,
          is_closed: listing.is_closed,
          user_rating: listing.user.user_stat.current_user_rating,
          listing_rating: listing.listing_stat.current_user_rating,
          loaded: true
        });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error('/rest/listings.json', status, err.toString());
      }.bind(this)
    });
  },
  _handleUserRate: function(rating, last_rating) {
    if(this.state.loaded && this.state.listing.user.id != this.props.current_user_id){
      $.ajax({
        url: '/rest/user_ratings',
        type: "post",
        dataType: 'json',
        data: {rating: rating, id: this.state.listing.user.id},
        success: function (rating) {
          l_updated = this.state.listing
          l_updated.user.user_stat.rating = +((l_updated.user.user_stat.rating_sum + rating.rating) / (l_updated.user.user_stat.rating_count + 1)).toFixed(1)
          l_updated.user.user_stat.rating_count += 1
          this.setState({
            user_rating: rating.rating,
            listing: l_updated
          });
        }.bind(this),
        error: function (xhr, status, err) {
          console.error('/rest/user_ratings', status, err.toString());
          $.growl.error({ title: '', message: "Алдаа гарлаа" , location: "br", delayOnHover: true});
        }.bind(this)
      });
    }
  },
  _handleListingRate: function(rating, last_rating) {
    if(this.state.loaded && this.state.listing.user.id != this.props.current_user_id){
      $.ajax({
        url: '/rest/listings/' + this.state.listing.id + '/listing_ratings',
        type: "post",
        dataType: 'json',
        data: {rating: rating},
        success: function (rating) {
          l_updated = this.state.listing
          l_updated.listing_stat.rating = +((l_updated.listing_stat.rating_sum + rating.rating) / (l_updated.listing_stat.rating_count + 1)).toFixed(1)
          l_updated.listing_stat.rating_count += 1
          this.setState({
            listing_rating: rating.rating,
            listing: l_updated
          });
        }.bind(this),
        error: function (xhr, status, err) {
          console.error('/rest/listing_ratings', status, err.toString());
          $.growl.error({ title: '', message: "Алдаа гарлаа" , location: "br", delayOnHover: true});
        }.bind(this)
      });
    }
  },
  _handleWishList: function(id){
    l_updated = this.state.listing
    l_updated.wish_listed = true
    this.setState({listing: l_updated});
  },
  _handleRevertWishList: function(id){
    l_updated = this.state.listing
    l_updated.wish_listed = false
    this.setState({listing: l_updated});
  },
  _handleCloseListing: function(e) {
    this.setState({is_closed: true});
  },
  render: function() {
    return (
      <div className="main">
        <Breadcrumb listing={this.state.listing} />
        <div className="container">
          <div className="deal-full-detail-page-container">
            <ListingDetail handleRate={this._handleListingRate} rating={this.state.listing_rating} listing={this.state.listing} current_user_id={this.props.current_user_id} handleWishList={this._handleWishList} handleRevertWishList={this._handleRevertWishList} handleCloseListing={this._handleCloseListing} loaded={this.state.loaded} is_closed={this.state.is_closed} />
            <RelatedItems />
          </div>
          <div className="main-right">
            <OwnerInfo handleRate={this._handleUserRate} rating={this.state.user_rating} current_user_id={this.props.current_user_id} user={this.state.listing.user || {}} loaded={this.state.loaded} />
            <FreeItemList />
            <div className="right-banner">
              <a href="#"><img src='/images/bobby_banner.jpg' /></a>
            </div>
          </div>
        </div>
      </div>
    );
  }
});


var ListingDetail = React.createClass({
  render: function() {
    var rater
    if(this.props.loaded){
      if(this.props.listing.user.id != this.props.current_user_id){
        rater = this.props.rating ? <Rating rating={Math.round(this.props.rating)}/> : <Rater onRate={this.props.handleRate}/>;
      }else{
        rater = <Rating rating={Math.round(this.props.listing.listing_stat.rating)} />
      }
    }

    var p_condition;
    if(this.props.listing.is_product){
      p_condition = (
        <div>
          <div className="full-detail-short-condition"><strong>Төлөв:</strong> {this.props.listing.item.product_condition.title}</div>
          <div className="hairly-line" />
        </div>
        );
    }
    var bid_prev;
    if(this.props.listing.bids && this.props.listing.bids.length > 0){
      bid_prev = (
        <div className="full-detail-short-deals-intro">
          <strong><a href="#received_bids">Ирсэн санал:</a> <br /></strong>
          <BidPreview bids={this.props.listing.bids} initAlsOnMount={true} />
        </div>
      );
    }
    var bid_prev_large;
    if(this.props.listing.bids && this.props.listing.bids.length > 0){
      bid_prev_large = (
        <div className="full-detail-bids">
          <a className="anchor" id="received_bids" />
          <strong>Ирсэн саналууд: <br /></strong>
          <BidPreviewLarge bids={this.props.listing.bids} />
        </div>
      );
    }
    
    var wish_list_button;
    if(this.props.loaded){
      wish_list_button = <WishListButton current_user_id={this.props.current_user_id} listing={this.props.listing} handleWishList={this.props.handleWishList} handleRevertWishList={this.props.handleRevertWishList} wish_listed={this.props.listing.wish_listed} is_closed={this.props.is_closed} />;
    }
    
    var listing_item_buttons;
    if(this.props.loaded){
      listing_item_buttons = <ListingItemButtons current_user_id={this.props.current_user_id} listing={this.props.listing} handleCloseListing={this.props.handleCloseListing} is_closed={this.props.is_closed} />
    }

    var spec_table;
    if(this.props.listing.specs && this.props.listing.specs.length > 0){
      spec_table = (
        <div className="full-detail-spec">
          <strong>Мэдээлэл: <br /></strong>
          <table border={0} cellPadding={0} cellSpacing={0} className="full-detail-spec-table table-striped">
            <tbody>
              {this.props.listing.specs.map(function(spec,index) {
                return (
                  <tr key={index}>
                    <td>{spec.name}</td>
                    <td>{spec.value}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    }

    return (
      <div className="deal-full-detail-page">
        <ImageViewer images={this.props.listing.images}/>
        <div className="full-detail-short-info">
          <div className="full-detail-title">{this.props.listing.title} {this.props.is_closed ? '(Тохиролцоо хаагдсан)' : ''}</div>
          <div className="full-detail-watchers">
            <span>Үзсэн: N/A</span>
            <div className="full-detail-rate">
              {rater} <span>{(this.props.listing.listing_stat && this.props.listing.listing_stat.rating) ? ('(' + this.props.listing.listing_stat.rating + ')') : ''}</span> <span>Үнэлсэн: {this.props.listing.listing_stat ? this.props.listing.listing_stat.rating_count : ''}</span>
            </div>
          </div>
          <div className="full-detail-short-information">
            {p_condition}
            <div className="full-detail-short-wanted">
              <strong>Хүсэж буй: </strong>
              <div>{this.props.listing.wanted_description}</div>
            </div>
            <div className="hairly-line" />
            <div className="full-detail-short-description-intro">
              <strong>Тайлбар: <br /></strong>
              {this.props.listing.text_description}<br />
              <a href="#listing_info" className="readmore-1">Дэлгэрэнгүй</a>
            </div>
            <div className="hairly-line" />
            {bid_prev}
            <div className="hairly-line" />
            <div className="full-detail-deal-buttons">
              <div style={{float: 'left'}}>
                {wish_list_button}
              </div>
              <div>
                {listing_item_buttons}
              </div>
            </div>
          </div>
          <div className="clearfix" />
        </div>
        <div className="hairly-line" />
        <div className="full-detail-full">
          <a className="anchor" id="listing_info" />
          <div className="full-detail-full-title">Барааны мэдээлэл</div>
          <div className="full-detail-description">
            <strong style={{fontSize: 14}}>Тайлбар: <br /></strong>
            <p>{this.props.listing.text_description}</p>
          </div>
          {spec_table}
          {bid_prev_large}
        </div>
        <div className="clearfix" />
      </div>
    );
  }
});

var RelatedItems = React.createClass({
  render: function(){
    return (
      <div className="deal-full-detail-page similar-items">
        <div className="home-module-title">Санал болгох (NOT IMPLEMENTED YET!!!)</div>
        <div className="similar-arrow-right" />
        <div className="similar-arrow-left" />
        <div className="deal-full-similar-items">
          <div className="deal-full-similar-item">
            <div className="deal-full-similar-item-img"><img src="/images/galaxyS5.jpg" /></div>
            <div className="deal-full-similar-item-name"><a href="#">Apple iphone 5s fu 32gb</a></div>
            <div className="deal-full-similar-item-user"><a href="#">Энхбаяр Элбэгдорж</a></div>
            <div className="deal-full-similar-item-discription">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            </div>
          </div>
          <div className="deal-full-similar-item">
            <div className="deal-full-similar-item-img"><img src="/images/no_image_large.jpg" /></div>
            <div className="deal-full-similar-item-name"><a href="#">Apple iphone 5s fu 32gb</a></div>
            <div className="deal-full-similar-item-user"><a href="#">Энхбаяр Элбэгдорж</a></div>
            <div className="deal-full-similar-item-discription">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            </div>
          </div>
          <div className="deal-full-similar-item">
            <div className="deal-full-similar-item-img"><img src="/images/no_image_large.jpg" /></div>
            <div className="deal-full-similar-item-name"><a href="#">Apple iphone 5s fu 32gb</a></div>
            <div className="deal-full-similar-item-user"><a href="#">Энхбаяр Элбэгдорж</a></div>
            <div className="deal-full-similar-item-discription">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            </div>
          </div>
          <div className="deal-full-similar-item">
            <div className="deal-full-similar-item-img"><img src="/images/iphone.jpg" /></div>
            <div className="deal-full-similar-item-name"><a href="#">Apple iphone 5s fu 32gb</a></div>
            <div className="deal-full-similar-item-user"><a href="#">Энхбаяр Элбэгдорж</a></div>
            <div className="deal-full-similar-item-discription">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            </div>
          </div>
        </div>
        <div className="clearfix" />
      </div>
    );
  }
});

module.exports = ListingShowPage;