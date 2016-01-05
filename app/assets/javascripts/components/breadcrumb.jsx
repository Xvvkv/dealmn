var Breadcrumb = React.createClass({
  render: function() {
    var items;
    if(this.props.listing.breadcrumb){
      items = (
        <ol className="breadcrumb">
          <li><a href="/">Нүүр</a></li>
          {this.props.listing.breadcrumb.map(function(item,index) {
            return (
              <li key={index}><a href="/">{item.name}</a></li>
            );
          })}         
          <li className="active">{this.props.listing.title}</li>
        </ol>
      );
    }
    return (
      <div className="breadcrumb-container">
        <div className="container">
          {items}
        </div>
      </div>
    );
  }
});

module.exports = Breadcrumb;

