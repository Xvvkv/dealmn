var ListingItem = require('./listing_item.jsx')

var Timeline = React.createClass({
  getInitialState: function() {
    return {
      special_listings: [],
      listings: []
    };
  },
  componentDidMount: function() {
    this.loadDataFromServer();
  },
  loadDataFromServer: function () {

    $.ajax({
      url: '/rest/listings.json',
      dataType: 'json',
      success: function (listings) {
        this.setState({
          listings: listings
        });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error('/rest/listings.json', status, err.toString());
      }.bind(this)
    });

  },
  render: function() {
    return (
      <div className="main-timeline">
        <div className="add-deal-button-container">
          <a href="/listings/new" className="btn btn-default">{I18n.page.add_spec}</a>
        </div>
        {this.state.listings.map(function(listing,index) {
          return (
            <ListingItem key={index} listing={listing} />
          );
        })}
      </div>
    );
  }
});

module.exports = Timeline;