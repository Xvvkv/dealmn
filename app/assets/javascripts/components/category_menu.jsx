var ReactMenuAim = require ('./mixins/react_menu_aim.js')

var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

var CategoryMenu = React.createClass({
  mixins: [ReactMenuAim],
  getDefaultProps: function() {
    return {
      submenuDirection: 'right'
    };
  },
  getInitialState: function() {
    return {
      activeMenuIndex: -1,
      items: [],
      loaded: false
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
        this.setState({items: categories, loaded: true});
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
    var sub, main;

    if(this.state.loaded && this.state.activeMenuIndex >= 0){
      var columns = [];
    
      this.state.items[self.state.activeMenuIndex].children.forEach(function(child) {
        columns[child.column_num] = columns[child.column_num] || [];
        columns[child.column_num].push(child);
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

    if(this.state.loaded){
      main = (
          <ul className="menu" onMouseLeave={this.handleMouseLeaveMenu}>
            {this.state.items.map(function(menu, index) {
              var className = 'menu-item';
              if (index === self.state.activeMenuIndex) {
                className += ' active';
              }
              return (
                <li className={className} key={index} onMouseEnter={function(){
                      self.handleMouseEnterRow.call(self, index, self.handleSwitchMenuIndex);
                    }}>
                  <a href={'/listings?c='+menu.id}>{menu.name} <span className="dc-mega-icon"></span></a>
                </li>
              );
            })}
          </ul>
      );
    }else{
      main = <div className="loader"><img src='/images/loader.gif' /> <div>Уншиж байна ...</div></div>
    }
    
    return (
      <div className="menu-container" onMouseLeave={function(){
                      self.handleMouseLeaveMenu.call(self, self.handleLeaveMenu);
                    }}>
        <div className="main-menu">
          {this.props.include_header && <div className="main-menu-header">{I18n.category.header}</div>}
          {main}
        </div>
        <ReactCSSTransitionGroup transitionName="slideleft" transitionEnterTimeout={300} transitionLeaveTimeout={200}>
          {sub}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
});



var SubMenuItem = React.createClass({
  render: function() {
    return (
      <ul>
        <a href={"/listings?c="+this.props.item.id}>{this.props.item.name}</a>
        {this.props.item.children.map(function(child, index){
          return (
            <li key={index}>
              <a href={"/listings?c="+child.id}>{child.name}</a>
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
          return <SubMenuItem key={index} item={item} />
        })}
      </li>
    );
  }
});

module.exports = CategoryMenu;
