var ItemSelector = React.createClass({
  getDefaultProps: function() {
    return {
      items: []
    };
  },
  render: function() {
    return (
      <div className="item-list-items">
        <div className="home-module-title">{this.props.title}</div>
        <div className="title_information">
          <div><span className="glyphicon glyphicon-info-sign"></span></div>
          <div>{this.props.hint}</div>
        </div>
        {this.props.items.map(function(item,index) {
          return (
            <ItemSelectorItem item={item} key={index} onSelectItem={this.props.onSelectItem} />
          );
        }.bind(this))}
      </div>
    );
  }
});

var ItemSelectorItem = React.createClass({
  render: function(){
    return (
      <div onClick={this.props.onSelectItem.bind(null,this.props.item)} className="right-deal-item">
        <div className="right-deal-item-img">
          {this.props.item.images && this.props.item.images.length > 0 ? <img src={this.props.item.images[0].url}/> : <img src='/images/123.jpg' />}
        </div>
        <div className="title-1">{this.props.item.title}</div>
        <div className="info-1">{this.props.item.description || this.props.item.text_description}</div>
        <div className="clearfix"></div>
      </div>
    );
  }
});

module.exports = ItemSelector