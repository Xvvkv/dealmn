var FreeItemList = require('./free_item_list.jsx');
var Timeline = require('./timeline.jsx');
var PubSub = require('pubsub-js');

$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return results[1] || 0;
    }
}

// need to dry
var CategorySelector = React.createClass({
  render: function() {

    var selected_cat_top, selected_cat_mid, selected_cat_sub;

    if(this.props.filters.top_level_cat){
      this.props.categories.forEach(function (category) {
        if(category.id == this.props.filters.top_level_cat.value){
          selected_cat_top = category;

        } 
      }.bind(this));
    }

    if(!selected_cat_top){ // nothings' selected
      res = (
        <div className="left-filter-category">
          <span className='selected'>Бүх ангилал</span>
            <ul>
              {this.props.categories.map(function(category,index) {
                return (
                  <li key={index}><a href="javascript:;" onClick={this.props.handleSelectCat.bind(null,category,null,null)}>{category.name}</a></li>
                );
              }.bind(this))}
            </ul>
        </div>
      );
    }else {
      if(this.props.filters.mid_level_cat){
        selected_cat_top.children.forEach(function (category) {
          if(category.id == this.props.filters.mid_level_cat.value){
            selected_cat_mid = category;
          } 
        }.bind(this));
      }
      

      if(!selected_cat_mid){ // top level cat is selected
        res = (
          <div className="left-filter-category">
            <a href="javascript:;" onClick={this.props.handleSelectCat.bind(null,null,null,null)}><span className="glyphicon glyphicon-menu-left"></span> Бүх ангилал</a>
            <div>
              <span className='selected'>{selected_cat_top.name}</span>
              <ul>
                {selected_cat_top.children.map(function(category,index) {
                  return (
                    <li key={index}><a href="javascript:;" onClick={this.props.handleSelectCat.bind(null,selected_cat_top,category,null)}>{category.name}</a></li>
                  );
                }.bind(this))}
              </ul>
            </div>
          </div>
        );
      }else{

        if(this.props.filters.sub_level_cat){
          selected_cat_mid.children.forEach(function (category) {
            if(category.id == this.props.filters.sub_level_cat.value){
              selected_cat_sub = category;
            } 
          }.bind(this));
        }
        
        if(!selected_cat_sub){ // mid level cat is selected
          res = (
            <div className="left-filter-category">
              <a href="javascript:;" onClick={this.props.handleSelectCat.bind(null,null,null,null)}><span className="glyphicon glyphicon-menu-left"></span> Бүх ангилал</a>
              <div>
                <a href="javascript:;" onClick={this.props.handleSelectCat.bind(null,selected_cat_top,null,null)}><span className="glyphicon glyphicon-menu-left"></span> {selected_cat_top.name}</a>
                <div>
                  <span className='selected'>{selected_cat_mid.name}</span>
                  <ul>
                    {selected_cat_mid.children.map(function(category,index) {
                      return (
                        <li key={index}><a href="javascript:;" onClick={this.props.handleSelectCat.bind(null,selected_cat_top,selected_cat_mid,category)}>{category.name}</a></li>
                      );
                    }.bind(this))}
                  </ul>
                </div>
              </div>
            </div>
          );
        }else{ // sub level cat is selected
          res = (
            <div className="left-filter-category">
              <a href="javascript:;" onClick={this.props.handleSelectCat.bind(null,null,null,null)}><span className="glyphicon glyphicon-menu-left"></span> Бүх ангилал</a>
              <div>
                <a href="javascript:;" onClick={this.props.handleSelectCat.bind(null,selected_cat_top,null,null)}><span className="glyphicon glyphicon-menu-left"></span> {selected_cat_top.name}</a>
                <div>
                  <a href="javascript:;" onClick={this.props.handleSelectCat.bind(null,selected_cat_top,selected_cat_mid,null)}><span className="glyphicon glyphicon-menu-left"></span> {selected_cat_mid.name}</a>
                  <div>
                    <span className='selected'>{selected_cat_sub.name}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        }
      }
    } 
    return res;
  }
});

var ListingsPage = React.createClass({
  getInitialState: function() {
    return {
      categories: [],
      loaded: false,
      is_free: false,
      product_condition: -1,
      rating: -1,
      include_closed: false,
      price_range_min: '',
      price_range_max: '',
      search_text: '',
      filters: {}
    };
  },
  componentWillMount: function(){
    var c = $.urlParam('c');

    if(c){
      var cInt = parseInt(c);
      if(cInt > 0 && cInt.toString() == c){
        this.setState({selectedCat: cInt});
      }
    }

    var search_text = $.urlParam('search_text');
    if(search_text){
      search_text_decoded = decodeURIComponent(search_text);
      filters = this.state.filters;
      filters['search_text'] = {display_name: search_text_decoded, value: search_text_decoded}
      this.setState({filters: filters});
    }
  },
  componentDidMount: function() {
    this.loadDataFromServer();
  },
  loadDataFromServer: function () {
    $.ajax({
      url: '/rest/categories.json',
      dataType: 'json',
      success: function (categories) {
        this.setState({categories: categories});
        if(this.state.selectedCat){ // came from menu click
          this.setInitialCategoryFilter();
        }else{
          this.setState({loaded: true});
        }
      }.bind(this),
      error: function (xhr, status, err) {
        console.error('/rest/categories.json', status, err.toString());
      }.bind(this)
    });
  },
  setInitialCategoryFilter: function(){
    this.state.categories.forEach(function (top_category) {
      if(top_category.id == this.state.selectedCat){ // top level menu clicked
        filters = this.state.filters;
        filters['top_level_cat'] = {display_name: top_category.name, value: top_category.id};
        delete filters.mid_level_cat;
        delete filters.sub_level_cat;
        this.setState({filters: filters, loaded: true});
        PubSub.publish('cat_selected', top_category.id);
        return;
      }
      top_category.children.forEach(function (mid_category) {
        if(mid_category.id == this.state.selectedCat){ // mid level menu clicked
          filters = this.state.filters;
          filters['top_level_cat'] = {display_name: top_category.name, value: top_category.id};
          filters['mid_level_cat'] = {display_name: mid_category.name, value: mid_category.id};
          delete filters.sub_level_cat;
          this.setState({filters: filters, loaded: true});
          PubSub.publish('cat_selected', top_category.id);
          return;
        }
        mid_category.children.forEach(function (sub_category) {
          if(sub_category.id == this.state.selectedCat){ // sub level menu clicked
            filters = this.state.filters;
            filters['top_level_cat'] = {display_name: top_category.name, value: top_category.id};
            filters['mid_level_cat'] = {display_name: mid_category.name, value: mid_category.id};
            filters['sub_level_cat'] = {display_name: sub_category.name, value: sub_category.id};
            this.setState({filters: filters, loaded: true});
            PubSub.publish('cat_selected', top_category.id);
            return;
          }
        }.bind(this));
      }.bind(this));
    }.bind(this));
  },
  _handleRemoveFilter: function(filter_type) {
    filters = this.state.filters;
    delete filters[filter_type];

    if(filter_type == 'top_level_cat'){
      delete filters['mid_level_cat'];
      delete filters['sub_level_cat'];
      PubSub.publish('cat_selected', -1);
    }

    if(filter_type == 'mid_level_cat'){
      delete filters['sub_level_cat'];
    }
    
    this.setState({filters: filters});

    this.refs.timeline.filterAgain();
  },
  _handleSelectCat: function(top_level_cat,mid_level_cat,sub_level_cat){
    filters = this.state.filters;

    if(!top_level_cat){
      delete filters['top_level_cat'];
      delete filters['mid_level_cat'];
      delete filters['sub_level_cat'];
      PubSub.publish('cat_selected', -1);
    }else {
      filters['top_level_cat'] = {display_name: top_level_cat.name, value: top_level_cat.id};
      PubSub.publish('cat_selected', top_level_cat.id);
      if(!mid_level_cat){
        delete filters['mid_level_cat'];
        delete filters['sub_level_cat'];
      }else{
        filters['mid_level_cat'] = {display_name: mid_level_cat.name, value: mid_level_cat.id};
        if(!sub_level_cat){
          delete filters['sub_level_cat'];
        }else{
          filters['sub_level_cat'] = {display_name: sub_level_cat.name, value: sub_level_cat.id};  
        }
      }
    }

    this.setState({filters: filters});
    this.refs.timeline.filterAgain(); 
    
  },
  render: function() {
    return (
      <div className="main">
        <div className="container">
          <div className="main-left">
            <div className="left-container">
              <div>
                {this.state.loaded && <CategorySelector categories={this.state.categories} filters={this.state.filters} handleSelectCat={this._handleSelectCat} />}
                <div className="hairly-line"></div>
                
                <div className="title5">Дэлгэрэнгүй хайлт</div>
                <div className="left-filter-condition">
                  <div className="title4">Төлөв</div>
                  <div>
                    <a className={this.state.product_condition == -1 ? "active" : ""} href="#">Бүх төлөв</a>
                  </div>
                  {this.props.p_conditions.map(function(condition,index) {
                    return (
                      <div key={index}>
                        <a className={condition.id == this.state.product_condition ? "active" : ""} href="#">{condition.title}</a>
                      </div>
                    );
                  }.bind(this))}
                </div>
                <div className="hairly-line"></div>
                <div className="left-filter-rank">
                  <div className="title4">Үнэлгээ</div>
                  <a href="#" className="active">
                    <div className="static-rating">
                      <span className="is-active">★</span>
                      <span className="is-active">★</span>
                      <span className="is-active">★</span>
                      <span className="is-active">★</span>
                      <span className="is-active">★</span>
                    </div> ба түүнээс дээш
                  </a>
                  <br/>                
                  <a href="#">
                    <div className="static-rating">
                      <span>★</span>
                      <span className="is-active">★</span>
                      <span className="is-active">★</span>
                      <span className="is-active">★</span>
                      <span className="is-active">★</span>
                    </div> ба түүнээс дээш
                  </a>
                  <br/>
                  <a href="#">
                    <div className="static-rating">
                      <span>★</span>
                      <span>★</span>
                      <span className="is-active">★</span>
                      <span className="is-active">★</span>
                      <span className="is-active">★</span>
                    </div> ба түүнээс дээш
                  </a>
                  <br/>
                  <a href="#">
                    <div className="static-rating">
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                      <span className="is-active">★</span>
                      <span className="is-active">★</span>
                    </div> ба түүнээс дээш
                  </a>
                  <br/>
                  <a href="#">
                    <div className="static-rating">
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                      <span className="is-active">★</span>
                    </div> ба түүнээс дээш
                  </a>
                </div>
                <div className="hairly-line"></div>
                <div className="left-filter-price">
                  <div className="title4">Мөнгөн үнэлгээ</div>
                  <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Доод</label>
                    <input type="text" className="form-control" id="low-price" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Дээд</label>
                    <input type="text" className="form-control" id="high-price" />
                  </div>
                  <div className="clearfix"></div>
                  <div className="checkbox">
                    <label>
                    <input type="checkbox" /> Үнэгүй
                    </label>
                  </div>
                </div>
                <div className="hairly-line"></div>
                <div className="left-filter-closed">
                  <div className="title4">Бусад</div>
                  <div className="checkbox">
                    <label>
                    <input type="checkbox" /> Хаагдсан тохиролцооноос хайх
                    </label>
                  </div>
                  <div className="clearfix"></div>
                </div>
              </div>
            </div>
            <div className="left-banner">
              <img src='/images/banner1.png' />
            </div>
          </div>
          {this.state.loaded && <Timeline ref='timeline' current_user_id={this.props.current_user_id} filters={this.state.filters} handleRemoveFilter={this._handleRemoveFilter}/>}
          <div className="main-right">
            <div className="right-banner">
              <a href="#"><img src='/images/bobby_banner.jpg' /></a>
            </div>
            <FreeItemList />
            <div className="right-banner">
              <a href="#"><img src='/images/bobby_banner.jpg' /></a>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ListingsPage;