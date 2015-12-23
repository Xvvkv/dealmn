var ListingItem = require('./listing_item.jsx')
var InfiniteScroll = require('react-infinite-scroll')(React);

var Timeline = React.createClass({
  getInitialState: function() {
    return {
      special_listings: [],
      listings: [],
      hasMore: true,
      min_publishment_id: -1
    };
  },
  componentDidMount: function() {
    this.loadDataFromServer();
  },
  loadDataFromServer: function () {
    //this.loadListings();
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
  render: function() {
    var items = this.state.listings.map(function(listing,index) {
      return (
        <ListingItem key={index} c={index} listing={listing} />
      );
    })
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