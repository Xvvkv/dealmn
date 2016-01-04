var Breadcrumb = require('./breadcrumb.jsx');
var ListingOwnerInfo = require('./listing_owner_info.jsx');
var ImageViewer = require('./image_viewer.jsx');
var Rater = require('react-rater');
var Rating = require('./fixed_star_rate.jsx');

var ListingShowPage = React.createClass({
  getInitialState: function() {
    return {
      listing: {}
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
          user_rating: listing.user.user_stat.current_user_rating,
          listing_rating: listing.listing_stat.current_user_rating
        });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error('/rest/listings.json', status, err.toString());
      }.bind(this)
    });
  },
  _handleUserRate: function(rating, last_rating) {
    $.ajax({
      url: '/rest/user_ratings',
      type: "post",
      dataType: 'json',
      data: {rating: rating, user_email: this.state.listing.user.email},
      success: function (rating) {
        l_updated = this.state.listing
        l_updated.user.user_stat.rating = +((l_updated.user.user_stat.rating * l_updated.user.user_stat.rating_count + rating.rating) / (l_updated.user.user_stat.rating_count + 1)).toFixed(1)
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
  },
  _handleListingRate: function(rating, last_rating) {
    $.ajax({
      url: '/rest/listings/' + this.state.listing.id + '/listing_ratings',
      type: "post",
      dataType: 'json',
      data: {rating: rating},
      success: function (rating) {
        l_updated = this.state.listing
        l_updated.listing_stat.rating = +((l_updated.listing_stat.rating * l_updated.listing_stat.rating_count + rating.rating) / (l_updated.listing_stat.rating_count + 1)).toFixed(1)
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
  },
  render: function() {
    return (
      <div className="main">
        <Breadcrumb />
        <div className="container">
          <div className="deal-full-detail-page-container">
            <ListingDetail handleRate={this._handleListingRate} rating={this.state.listing_rating} listing={this.state.listing}/>
            <RelatedItems />
          </div>
          <div className="main-right">
            <ListingOwnerInfo handleRate={this._handleUserRate} rating={this.state.user_rating} user={this.state.listing.user || {}} />
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
    var rater = this.props.rating ? <Rating rating={Math.round(this.props.rating)}/> : <Rater onRate={this.props.handleRate}/>;
    return (
      <div className="deal-full-detail-page">
        <ImageViewer images={this.props.listing.images}/>
        <div className="full-detail-short-info">
        <div className="full-detail-title">{this.props.listing.title}</div>
        <div className="full-detail-watchers">
          <span>Үзсэн: N/A</span>
          <div className="full-detail-rate">
            {rater} <span>{(this.props.listing.listing_stat && this.props.listing.listing_stat.rating) ? ('(' + this.props.listing.listing_stat.rating + ')') : ''}</span> <span>Үнэлсэн: {this.props.listing.listing_stat ? this.props.listing.listing_stat.rating_count : ''}</span>
          </div>
        </div>
        <div className="full-detail-short-information">
        <div className="full-detail-short-condition"><strong>Төлөв:</strong> Шинэвтэр</div>
        <div className="hairly-line" />
        <div className="full-detail-short-wanted">
          <strong>Хүсэж буй: </strong>
          <div><a href="#">SamsungGalaxyS6</a>, <a href="#">SamsungGalaxyS5</a>, <a href="#">IpadMini3</a></div>
        </div>
        <div className="hairly-line" />
          <div className="full-detail-short-description-intro">
            <strong>Тайлбар: <br /></strong>
            It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.<br />
            <a href="#listing_info" className="readmore-1">Дэлгэрэнгүй</a>
          </div>
          <div className="hairly-line" />
            <div className="full-detail-short-deals-intro">
              <strong><a href="#received_bids">Ирсэн санал:</a> <br /></strong>
              <div className="full-detail-short-deals-intro-items">
                <a href="#"><img src="/images/123.jpg" /></a>
                <a href="#"><img src="/images/123.jpg" /></a>
                <a href="#"><img src="/images/123.jpg" /></a>
                <a href="#"><img src="/images/123.jpg" /></a>
              </div>
            </div>
            <div className="hairly-line" />
              <div className="full-detail-deal-buttons">
                <div className="checkbox btn btn-default">
                  <label>
                  <input type="checkbox" /> Дугуйлах
                  </label>
                </div>
                <div className="btn btn-primary" style={{marginTop: 10}}>Санал илгээх
              </div>
              <div className="btn btn-success" style={{marginTop: 10}}>Чатлах
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
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
            </p>
          </div>
          <div className="full-detail-spec">
            <strong>Үзүүлэлт: <br /></strong>
            <table border={0} cellPadding={0} cellSpacing={0} className="full-detail-spec-table table-striped">
              <tbody>
                <tr>
                  <td style={{height: 20, width: 215}}>Сүлжээ</td>
                  <td style={{width: 515}}>Gsm / HSPA / LTE</td>
                </tr>
                <tr>
                  <td style={{height: 20}}>Худалдаанд гарсан хугацаа</td>
                  <td>2015 оны 1-р сар</td>
                </tr>
                <tr>
                  <td style={{height: 20}}>Хэмжээ</td>
                  <td>151 x 76.2 x 6.3 mm</td>
                </tr>
                <tr>
                  <td style={{height: 20}}>Сим</td>
                  <td>Нано сим</td>
                </tr>
                <tr>
                  <td style={{height: 20}}>Жин</td>
                  <td>141 гр</td>
                </tr>
                <tr>
                  <td style={{height: 76}}>Дэлгэц</td>
                  <td style={{width: 515}}>Super AMOLED capacitive touchscreen, 16M colors, 1080 x 1920 pixel, multi touch, 5.5 инч, Gorilla зурагддаггүй шил&nbsp;</td>
                </tr>
                <tr>
                  <td style={{height: 20}}>Version</td>
                  <td>Android OS, v4.4.4 (KitKat),&nbsp;</td>
                </tr>
                <tr>
                  <td style={{height: 20}}>CPU</td>
                  <td>Quad-core 1.5 GHz Cortex-A53 &amp; quad-core 1.0 GHz Cortex-A53 - A700FD</td>
                </tr>
                <tr>
                  <td style={{height: 20}}>Мемору карт</td>
                  <td>64 Gb-ийг нэмэх боломжтой</td>
                </tr>
                <tr>
                  <td style={{height: 20}}>Багтаамж&nbsp;</td>
                  <td>16 Gb</td>
                </tr>
                <tr>
                  <td style={{height: 20}}>Ram</td>
                  <td>2 Gb</td>
                </tr>
                <tr>
                  <td rowSpan={2} style={{height: 77}}>Камер</td>
                  <td style={{width: 515}}>Ард камер 13 Mp, 4128 x 3096 pixels, автомат фокус тааруулагч, LED гэрэлтэй,&nbsp;</td>
                </tr>
                <tr>
                  <td style={{height: 20}}>Урд камер 5 Mp, 1080p</td>
                </tr>
                <tr>
                  <td style={{height: 20}}>&nbsp;</td>
                  <td>&nbsp;</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="full-detail-bids">
            <a className="anchor" id="received_bids" />
            <strong>Ирсэн саналууд: <br /></strong>
            <div className="full-detail-bid-item">
              <div className="full-detail-bid-item-detail-img">
                <img src="/images/galaxyS5.jpg" />
              </div>
              <div className="full-detail-bid-item-detail">
                <div className="full-detail-bid-item-detail-title"><a href="#">Samsung Galaxy S5 Euro</a></div>
                <div className="full-detail-bid-user"><a href="#">Бадар-Ууган Чагнаадорж</a></div>
                <div className="full-detaul-bid-item-detail-description">
                  За шууд соливол солий, тулвал тулая. Цоо шинэ хайрцаг савтайгаа Samsung Galaxy S5 Euro байна.
                </div>
              </div>
            </div>
            <div className="full-detail-bid-item">
              <div className="full-detail-bid-item-detail-img">
                <img src="/images/galaxyS5.jpg" />
              </div>
              <div className="full-detail-bid-item-detail">
                <div className="full-detail-bid-item-detail-title"><a href="#">Samsung Galaxy S5 Euro</a></div>
                <div className="full-detail-bid-user"><a href="#">Бадар-Ууган Чагнаадорж</a></div>
                <div className="full-detaul-bid-item-detail-description">
                  За шууд соливол солий, тулвал тулая. Цоо шинэ хайрцаг савтайгаа Samsung Galaxy S5 Euro байна.
                </div>
              </div>
            </div>
            <div className="full-detail-bid-item">
              <div className="full-detail-bid-item-detail-img">
                <img src="/images/galaxyS5.jpg" />
              </div>
              <div className="full-detail-bid-item-detail">
                <div className="full-detail-bid-item-detail-title"><a href="#">Samsung Galaxy S5 Euro</a></div>
                <div className="full-detail-bid-user"><a href="#">Бадар-Ууган Чагнаадорж</a></div>
                <div className="full-detaul-bid-item-detail-description">
                  За шууд соливол солий, тулвал тулая. Цоо шинэ хайрцаг савтайгаа Samsung Galaxy S5 Euro байна.
                </div>
              </div>
            </div>
            <div className="full-detail-bid-item">
              <div className="full-detail-bid-item-detail-img">
                <img src="/images/galaxyS5.jpg" />
              </div>
              <div className="full-detail-bid-item-detail">
                <div className="full-detail-bid-item-detail-title"><a href="#">Samsung Galaxy S5 Euro</a></div>
                <div className="full-detail-bid-user"><a href="#">Бадар-Ууган Чагнаадорж</a></div>
                <div className="full-detaul-bid-item-detail-description">
                  За шууд соливол солий, тулвал тулая. Цоо шинэ хайрцаг савтайгаа Samsung Galaxy S5 Euro байна.
                </div>
              </div>
            </div>
          </div>
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
        <div className="home-module-title">Санал болгох</div>
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
            <div className="deal-full-similar-item-img"><img src="/images/1234.jpg" /></div>
            <div className="deal-full-similar-item-name"><a href="#">Apple iphone 5s fu 32gb</a></div>
            <div className="deal-full-similar-item-user"><a href="#">Энхбаяр Элбэгдорж</a></div>
            <div className="deal-full-similar-item-discription">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            </div>
          </div>
          <div className="deal-full-similar-item">
            <div className="deal-full-similar-item-img"><img src="/images/123.jpg" /></div>
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