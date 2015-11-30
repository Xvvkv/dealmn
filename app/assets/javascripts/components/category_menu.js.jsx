var CategoryMenu = React.createClass({

  getInitialState: function () {
    return {items: []};
  },
  componentDidMount: function() {
    this.loadDataFromServer();
  },
  componentDidUpdate: function() {
    this.constructMenu();
  },
  loadDataFromServer: function () {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function (categories) {
        this.setState({items: categories});
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  constructMenu: function () {
    $(this._menu).dcVerticalMegaMenu({
      rowItems: '3',
      speed: 'fast',
      effect: 'fade',
      direction: 'right'
    });
  },
  render: function() {
    var items = this.state.items.map(function (item, index) {
      return (
        <CategoryMenuItem name={item.name} children={item.children} key={index} />
      );
    });
    return (
    <div className="main-menu">
      {this.props.include_header && <div className="main-menu-header">Ангилал</div>}
      <ul ref={(c) => this._menu = c} className="mega-menu">
        {items}
      </ul>
    </div>
    );
  }
});

var CategoryMenuItem = React.createClass({
  render: function() {
    var children;
    if(this.props.children){
      var children = this.props.children.map(function (child, index) {
      return (
        <CategoryMenuItem name={child.name} children={child.children} key={index} />
        );
      });
      children = <ul>{children}</ul>
    }
    return (
      <li>
        <a href="#">{this.props.name}</a>
        {children}
      </li>
    );
  }
});








    

                    
                        
                        