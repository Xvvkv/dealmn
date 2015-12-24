var ListingItem = require('./listing_item.jsx')
var InfiniteScroll = require('react-infinite-scroll')(React);

var Timeline = React.createClass({
  getInitialState: function() {
    return {
      special_listings: [],
      listings: [],
      hasMore: true,
      min_publishment_id: -1,
      wish_list: []
    };
  },
  componentDidMount: function() {
    this.loadDataFromServer();
  },
  loadDataFromServer: function () {
    $.ajax({
      url: '/rest/wish_lists.json',
      dataType: 'json',
      success: function (wish_list) {
        this.setState({wish_list: wish_list});
      }.bind(this),
      error: function (xhr, status, err) {
        console.error('/rest/wish_lists.json', status, err.toString());
      }.bind(this)
    });
  },
  loadListings: function(page) {
    $.ajax({
      url: '/rest/listings.json?pid=' + this.state.min_publishment_id,
      dataType: 'json',
      success: function (listings) {
        if(listings.length > 0){          
          var l = this.state.listings.concat(listings);
          
          this.setState({
            listings: l,
            min_publishment_id: listings[listings.length - 1].publishment_id
          });
        }else {
          this.setState({hasMore: false});
        }
      }.bind(this),
      error: function (xhr, status, err) {
        console.error('/rest/listings.json', status, err.toString());
      }.bind(this)
    });
  },
  _handleWishListClick: function(id){
    $.ajax({
      url: '/rest/wish_lists',
      type: "post",
      dataType: 'json',
      data: {listing_id: id},
      success: function (wl) {
        $.growl.notice({ title: '', message: "Дугуйлагдлаа" , location: "br", delayOnHover: true});
        var wish_list = this.state.wish_list
        wish_list.push(id);
        this.setState({wish_list: wish_list});

      }.bind(this),
      error: function (xhr, status, err) {
        console.error('/rest/listings', status, err.toString());
        $.growl.error({ title: '', message: "Алдаа гарлаа" , location: "br", delayOnHover: true});

        //$(this.refs.saveButton).button('reset');
      }.bind(this)
    });
  },
  render: function() {
    var items = this.state.listings.map(function(listing,index) {
      return (
        <ListingItem key={index} c={index} listing={listing} wish_listed={this.state.wish_list.indexOf(listing.id) > -1} handleWishListClick={this._handleWishListClick} />
      );
    }.bind(this))
    return (
      <div className="main-timeline">
        <div className="add-deal-button-container">
          <a href="/listings/new" className="btn btn-default">{I18n.page.add_spec}</a>
        </div>
        <InfiniteScroll
            pageStart={0}
            loadMore={this.loadListings}
            hasMore={this.state.hasMore}
            loader={<div className="loader">Loading ...</div>}>
          {items}
        </InfiniteScroll>
      </div>
    );
  }
});

module.exports = Timeline;