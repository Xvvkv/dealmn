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

  render: function() {
    var self = this;

    console.log(this.state.items.length);
    console.log(this.state.activeMenuIndex);

    var sub;
    if(this.state.items.length > 0 && this.state.activeMenuIndex >= 0){
      sub = <ul className="sub-menu">
          {this.state.items[self.state.activeMenuIndex].children.map((function(child, index){
            return (
              <li className="sub-menu-item" key={index}>{child.name}</li>
            );
          }))}
        </ul>
    }

    return (
      <div>
        <div>
        <ul className="menu" onMouseLeave={this.handleMouseLeaveMenu}>
          {this.state.items.map(function(menu, index) {
            var className = 'menu-item';
            if (index === self.state.activeMenuIndex) {
              className += ' active';
            }

            return (
              <li className={className} key={index}
                  onMouseEnter={function(){
                    self.handleMouseEnterRow.call(self, index, self.handleSwitchMenuIndex);
                  }}>
                {menu.name}
              </li>
            );
          })}
        </ul>
        </div>
        <div>
        {sub}
        </div>
      </div>
    );
  }
});