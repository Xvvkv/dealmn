var TestMenu = React.createClass({

  getInitialState: function () {
    return {items: [], hover:false, selected_sub: 1};
  },
  componentDidMount: function() {
    this.loadDataFromServer();
  },
  componentDidUpdate: function() {
    //this.constructMenu();
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
  onMouseEnterHandler: function() {
      this.setState({
          hover: true
      });
      console.log('enter');
  },
  onMouseLeaveHandler: function() {
      this.setState({
          hover: false
      });
      console.log('leave');
  },
  handleUserInput: function(selected_sub) {
        this.setState({
            selected_sub: selected_sub
        });
        console.log(this.state.selected_sub);
    },
  render: function() {
    var items = this.state.items.map(function (item, index) {
      return (
        <TestMenuItem name={item.name} children={item.children} id={index} key={index} hellooo={this.handleUserInput} />
      );
    }.bind(this));
    var sub;
    if(this.state.hover){
      sub = <div className="leftfloat test_sub">{this.state.selected_sub}</div>;
    }

    return (
    <div className="main-menu">
    <div className="leftfloat" onMouseEnter={this.onMouseEnterHandler}
                    onMouseLeave={this.onMouseLeaveHandler}>
      {this.props.include_header && <div className="main-menu-header">{I18n.category.header}</div>}
      <ul ref={(c) => this._menu = c} className="mega-menu">
        {items}
      </ul>
    </div>
    {sub}
    </div>
    );
  }
});

var TestMenuItem = React.createClass({
  onMouseEnterHandler: function() {
    console.log(this.props);
    this.props.hellooo(this.props.id);
  },
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
        <a href="#" onMouseEnter={this.onMouseEnterHandler}>{this.props.name}</a>
        
      </li>
    );
  }
});
    

                    
                        
                        