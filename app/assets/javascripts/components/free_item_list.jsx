var FreeItem = React.createClass({
  render: function() {
    return (
      <div className="item-list-item">
        <div className="item-list-item-img">
          <div className="mini-badget free-badget"></div>
          <img src={this.props.listing.images && this.props.listing.images.length > 0 ? this.props.listing.images[0].url : '/images/no_image.jpg'} />
        </div>
        <div className="title-1"><a href={'/listings/' + this.props.listing.id}>{this.props.listing.title}</a></div>
        <div className="info-1">{this.props.listing.text_description}</div>
        <div className="clearfix"></div>
      </div>
    );
  }
});

var FreeItemList = React.createClass({
  getInitialState: function() {
    return {
      listings: [],
      loaded: false
    };
  },
  componentDidMount: function() {
    this.loadDataFromServer();
  },
  loadDataFromServer: function () {
    $.ajax({
      url: '/rest/listings/free_items.json',
      dataType: 'json',
      success: function (listings) {
        this.setState({
          listings: listings,
          loaded: true
        });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error('/rest/free_items.json', status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    var content;
    if(this.state.loaded){
      if(this.state.listings.length > 0){
        content = this.state.listings.map(function(listing,index) {
                return (
                  <FreeItem listing={listing} key={index} />
                );
              })
      }else{
        content = <div className="no-content-info">Одоогоор идэвхитэй үнэгүй бараа байхгүй байна</div>
      }
    }else{
      content = <div className="loader"><img src='/images/loader.gif' /> <div>Уншиж байна ...</div></div>
    }
    return (
      <div className="item-list-items">
        <div className="home-module-title">Үнэгүй бараа</div>
        <div style={{maxHeight: 400, overflowY: 'scroll', paddingTop: 5}}>
          {content}
        </div>
      </div>
    );
  }
});

module.exports = FreeItemList;

      