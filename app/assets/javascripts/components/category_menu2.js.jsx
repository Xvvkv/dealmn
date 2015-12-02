// = require ./mixins/react_menu_aim
var CategoryMenu2 = React.createClass({
  mixins: [ReactMenuAim],
  getDefaultProps: function() {
    return {
      submenuDirection: 'right'
    };
  },
  getInitialState: function() {
    return {
      activeMenuIndex: -1,
      items: []
    };
  },
  componentWillMount: function() {
    this.initMenuAim({
      submenuDirection: this.props.submenuDirection,
      menuSelector: '.menu',
      delay: 300,
      tolerance: 75
    });
  },
  componentDidMount: function() {
    this.loadDataFromServer();
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
  handleSwitchMenuIndex: function(index) {
    this.setState({
      activeMenuIndex: index
    });
  },
  handleLeaveMenu: function() {
    this.setState({
      activeMenuIndex: -1
    });
  },
  render: function() {
    var self = this;
    var sub;

    if(this.state.items.length > 0 && this.state.activeMenuIndex >= 0){
      var columns = [];
    
      this.state.items[self.state.activeMenuIndex].children.forEach(function(child) {
        columns[child.column_num] = columns[child.column_num] || [];
        columns[child.column_num].push(child);
      });
      
      columns.forEach(function(col){

      });

      sub = <div className="sub-menu">
              <ul>
                {columns.map(function(col,index) {
                  return (
                    <SubMenuColumn key={index} items={col} />
                  );
                })}
              </ul>
            </div>;
    }

    console.log(sub);
    


    
    return (
      <div>
        <div className="main-menu">
          <ul className="menu" onMouseLeave={function(){
                      self.handleMouseLeaveMenu.call(self, self.handleLeaveMenu);
                    }}>
            {this.state.items.map(function(menu, index) {
              return (
                <li key={index} onMouseEnter={function(){
                      self.handleMouseEnterRow.call(self, index, self.handleSwitchMenuIndex);
                    }}>
                  <a href="#">{menu.name}</a>
                </li>
              );
            })}
          </ul>
        </div>
        {sub}
      </div>
    );
  }
});



var SubMenuItem = React.createClass({
  render: function() {
    return (
      <ul>
        <a href="#">{this.props.name}</a>
        {this.props.children.map(function(child, index){
          return (
            <li key={index}>
              <a href="#">{child.name}</a>
            </li>
          );
        })}
      </ul>
    );
  }
});

var SubMenuColumn = React.createClass({
  render: function() {
    return (
      <li>
        {this.props.items.map(function(item, index){
          return <SubMenuItem name={item.name} children={item.children} />
        })}
      </li>
    );
  }
});

