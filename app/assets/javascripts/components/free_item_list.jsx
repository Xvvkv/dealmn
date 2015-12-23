var FreeItemList = React.createClass({
  getDefaultProps: function() {
    return {
      items: [1,1,1,1,1,1]
    };
  },
  render: function() {
    return (
      <div className="item-list-items">
        <div className="home-module-title">Үнэгүй бараа</div>
        {this.props.items.map(function(item,index) {
          return (
            <FreeItem item={item} key={index} />
          );
        })}
      </div>
    );
  }
});

var FreeItem = React.createClass({
  render: function() {
    return (
      <div className="item-list-item">
        <div className="item-list-item-img">
          <div className="item-list-item-badget"></div>
          <img src='/images/123.jpg' />
        </div>
        <div className="title-1">Iphone 6 space grey</div>
        <div className="info-1">Хэрэгтэй нэгэнд нь хэрэг болох биз үнэгүй ирээд аваарай.</div>
        <div className="clearfix"></div>
      </div>
    );
  }
});

module.exports = FreeItemList;

      