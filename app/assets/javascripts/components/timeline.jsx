var ListingItem = require('./listing_item.jsx')
var InfiniteScroll = require('react-infinite-scroll')(React);

var Timeline = React.createClass({
  getInitialState: function() {
    return {
      special_listings: [],
      listings: [],
      hasMore: true,
      min_publishment_id: -1,
      wish_list: null
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
  _handleWishList: function(id){
    var wish_list = this.state.wish_list
    wish_list.push(id);
    this.setState({wish_list: wish_list});
  },
  _handleRevertWishList: function(id){
    var wish_list = this.state.wish_list
    var index = wish_list.indexOf(id);
    if (index > -1) {
      wish_list.splice(index, 1);
    }
    this.setState({wish_list: wish_list});
  },
  render: function() {
    var items = this.state.listings.map(function(listing,index) {
      return (
        <ListingItem key={index} listing={listing} wish_listed={this.state.wish_list ? this.state.wish_list.indexOf(listing.id) > -1 : null} handleWishList={this._handleWishList} handleRevertWishList={this._handleRevertWishList} current_user_id={this.props.current_user_id} />
      );
    }.bind(this))
    var timeline;
    if(!this.state.hasMore && items.length == 0){
      timeline = (
        <div className="no-item-here">
          Тохиролцоо олдсонгүй.
        </div>
      );
    }else{
      timeline = (
        <InfiniteScroll
            pageStart={0}
            loadMore={this.loadListings}
            hasMore={this.state.hasMore}
            loader={<div className="loader"><img src='/images/loader.gif' /> <div>Уншиж байна ...</div></div>}>
          {items}
        </InfiniteScroll>
      );
    }
    return (
      <div className="main-timeline">
        <div className="add-deal-button-container">
          <a href="/listings/new" className="btn btn-default">{I18n.page.add_spec}</a>
        </div>
        {timeline}
      </div>
    );
  }
});

module.exports = Timeline;