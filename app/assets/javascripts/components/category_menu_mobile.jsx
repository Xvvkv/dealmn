var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

var CategoryMenuMobile = React.createClass({
  getInitialState: function() {
    return {
      categories: [],
      loaded: false
    };
  },
  componentDidMount: function() {
    this.loadDataFromServer();
  },
  loadDataFromServer: function () {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function (categories) {
        this.setState({categories: categories, loaded: true});
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleSelectCat: function(top_level_cat,mid_level_cat,sub_level_cat){
    this.setState({
      selected_cat_top: top_level_cat,
      selected_cat_mid: mid_level_cat,
      selected_cat_sub: sub_level_cat
    });
  },
  render: function() {
    var res;
    if(this.state.loaded){
      if(!this.state.selected_cat_top){ // nothings' selected
        res = (
          <div className="mobile-menu">
            <span className='selected'>Бүх ангилал</span>
              <ul>
                {this.state.categories.map(function(category,index) {
                  return (
                    <li key={index}><a href="javascript:;" onClick={this.handleSelectCat.bind(null,category,null,null)}>{category.name}</a></li>
                  );
                }.bind(this))}
              </ul>
          </div>
        );
      }else {
        if(!this.state.selected_cat_mid){ // top level cat is selected
          res = (
            <div className="mobile-menu">
              <a href="javascript:;" onClick={this.handleSelectCat.bind(null,null,null,null)}>Бүх ангилал</a>
              <div>
                <span className='selected'>{this.state.selected_cat_top.name}</span>
                <ul>
                  {this.state.selected_cat_top.children.map(function(category,index) {
                    return (
                      <li key={index}><a href="javascript:;" onClick={this.handleSelectCat.bind(null,this.state.selected_cat_top,category,null)}>{category.name}</a></li>
                    );
                  }.bind(this))}
                </ul>
              </div>
            </div>
          );
        }else{
          if(!this.state.selected_cat_sub){ // mid level cat is selected
            res = (
              <div className="mobile-menu">
                <a href="javascript:;" onClick={this.handleSelectCat.bind(null,null,null,null)}>Бүх ангилал</a>
                <div>
                  <a href="javascript:;" onClick={this.handleSelectCat.bind(null,this.state.selected_cat_top,null,null)}>{this.state.selected_cat_top.name}</a>
                  <div>
                    <span className='selected'>{this.state.selected_cat_mid.name}</span>
                    <ul>
                      {this.state.selected_cat_mid.children.map(function(category,index) {
                        return (
                          <li key={index}><a href="javascript:;" onClick={this.handleSelectCat.bind(null,this.state.selected_cat_top,this.state.selected_cat_mid,category)}>{category.name}</a></li>
                        );
                      }.bind(this))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          }else{
            res = (
              <div className="mobile-menu">
                <a href="javascript:;" onClick={this.handleSelectCat.bind(null,null,null,null)}>Бүх ангилал</a>
                <div>
                  <a href="javascript:;" onClick={this.handleSelectCat.bind(null,this.state.selected_cat_top,null,null)}>{this.state.selected_cat_top.name}</a>
                  <div>
                    <a href="javascript:;" onClick={this.handleSelectCat.bind(null,this.state.selected_cat_top,this.state.selected_cat_mid,null)}>{this.state.selected_cat_mid.name}</a>
                    <div>
                      <span className='selected'>{this.state.selected_cat_sub.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        }
      }
    }else{
      res = (
        <div className="mobile-menu">
          <span className='selected'>Бүх ангилал</span>
          <div className="loader">
            <img src='/images/loader.gif' /> <div>Уншиж байна ...</div>
          </div>
        </div>
      );
    }
    
    return res;
  }
});

module.exports = CategoryMenuMobile;
