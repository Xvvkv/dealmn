var ListingItem = require('./listing_item.jsx')
var InfiniteScroll = require('react-infinite-scroll')(React);

var Timeline = React.createClass({
  getInitialState: function() {
    return {
      listing_ids: [],
      listings: [],
      hasMore: true,
      hasMoreIds: true,
      min_publishment_id: -1,
      wish_list: null,
      is_loading: false,
      is_loading_ids: false
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
  loadListingIds: function() {
    if(this.state.is_loading_ids){
      return;
    }

    if(!this.state.hasMoreIds){
      this.setState({hasMore: false});
      return;
    }

    this.setState({is_loading_ids: true});

    var data = {}

    if(this.state.min_publishment_id != -1){
      data['pid'] = this.state.min_publishment_id;
    }

    if(this.props.filters){
      if(this.props.filters.top_level_cat){
        if(this.props.filters.mid_level_cat){
          if(this.props.filters.sub_level_cat){
            data['category_id'] = this.props.filters.sub_level_cat.value;
          }else{
            data['category_id'] = this.props.filters.mid_level_cat.value;
          }
        }else{
          data['category_id'] = this.props.filters.top_level_cat.value;
        }
      }
    }

    ["is_free","product_condition","rating","include_closed","search_text"].forEach(function(filter_type) {
      if(this.props.filters && this.props.filters[filter_type]){
        data[filter_type] = this.props.filters[filter_type].value;
      }
    }.bind(this));

    if(this.props.filters && this.props.filters.top_level_cat && this.props.filters.top_level_cat.value == this.props.service_cat){
      delete data["product_condition"]
    }

    if(this.props.filters && this.props.filters.price_range){
      var price_range = this.props.filters.price_range.value.split("/");
      if (price_range[0] != ""){
        data["price_range_min"] = price_range[0];
      }
      if (price_range[1] != ""){
        data["price_range_max"] = price_range[1];
      }
    }

    if(this.props.filters && this.props.filters.is_free){
      delete data["price_range_min"]
      delete data["price_range_max"]
    }

    $.ajax({
      url: '/rest/listings/fetch_ids.json',
      data: data,
      dataType: 'json',
      success: function (ids) {
        if(ids.length < 200){
          this.setState({hasMoreIds: false});
        }
        if(ids.length > 0){
          this.setState({listing_ids: ids});
          this.loadListings();
        }
      }.bind(this),
      error: function (xhr, status, err) {
        console.error('/rest/listings/fetch_ids.json', status, err.toString());
      }.bind(this),
      complete: function (){
        this.setState({is_loading_ids: false});
      }.bind(this)
    });
  },
  loadListings: function(page) {
    if(this.state.is_loading){
      return;
    }
    if(this.state.listing_ids.length == 0){
      this.loadListingIds();
      return;
    }

    var slice_size = 10;
    if(this.state.min_publishment_id == -1){
      slice_size = 20;
    }

    var ids = this.state.listing_ids.slice(0,slice_size);

    this.setState({is_loading: true});

    $.ajax({
      url: '/rest/listings.json',
      data: {ids: ids},
      dataType: 'json',
      success: function (listings) {
        var l = this.state.listings.concat(listings);
        var ids = this.state.listing_ids;
        ids.splice(0,slice_size);
        this.setState({
          listings: l,
          listing_ids: ids,
          min_publishment_id: listings[listings.length - 1].publishment_id
        });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error('/rest/listings.json', status, err.toString());
      }.bind(this),
      complete: function () {
        this.setState({is_loading: false});
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
  filterAgain: function() {
    this.setState({
      listing_ids: [],
      listings: [],
      hasMore: true,
      hasMoreIds: true,
      min_publishment_id: -1,
    })
  },
  render: function() {
    var items = this.state.listings.map(function(listing,index) {
      return (
        <ListingItem key={index} listing={listing} wish_listed={this.state.wish_list ? this.state.wish_list.indexOf(listing.id) > -1 : null} handleWishList={this._handleWishList} handleRevertWishList={this._handleRevertWishList} current_user_id={this.props.current_user_id} is_mobile={this.props.is_mobile}/>
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
    var filter_box;
    if(this.props.filters && Object.keys(this.props.filters).length > 0){
      filter_box = (
        <div className="timeline-message-box">
          {Object.keys(this.props.filters).map(function(filter_type,index) {
            return (
              <div key={index} className="timeline-message-box-items" onClick={this.props.handleRemoveFilter.bind(null,filter_type)}>{this.props.filters[filter_type].display_name} <span className="glyphicon glyphicon-remove" /></div>
            );
          }.bind(this))}
          <div className="clearfix" />
        </div>
      );
    }
    return (
      <div className="main-timeline">
        <div className="add-deal-button-container">
          <a href="/listings/new" className="btn btn-default">{I18n.page.add_spec}</a>
        </div>
        {filter_box}
        <div className="clearfix" />
        {timeline}
      </div>
    );
  }
});

module.exports = Timeline;