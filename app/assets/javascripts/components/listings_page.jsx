var FreeItemList = require('./free_item_list.jsx');
var Timeline = require('./timeline.jsx');
var PubSub = require('pubsub-js');
var Rating = require('./fixed_star_rate.jsx');

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

    var selected_cat_top, selected_cat_mid, selected_cat_sub, res;

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
      filters: {},
      price_range_min: '',
      price_range_max: ''
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
      var search_text_decoded = decodeURIComponent(search_text);
      var filters = this.state.filters;
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
        var filters = this.state.filters;
        filters['top_level_cat'] = {display_name: top_category.name, value: top_category.id};
        delete filters.mid_level_cat;
        delete filters.sub_level_cat;
        this.setState({filters: filters, loaded: true});
        PubSub.publish('cat_selected', top_category.id);
        return;
      }
      top_category.children.forEach(function (mid_category) {
        if(mid_category.id == this.state.selectedCat){ // mid level menu clicked
          var filters = this.state.filters;
          filters['top_level_cat'] = {display_name: top_category.name, value: top_category.id};
          filters['mid_level_cat'] = {display_name: mid_category.name, value: mid_category.id};
          delete filters.sub_level_cat;
          this.setState({filters: filters, loaded: true});
          PubSub.publish('cat_selected', top_category.id);
          return;
        }
        mid_category.children.forEach(function (sub_category) {
          if(sub_category.id == this.state.selectedCat){ // sub level menu clicked
            var filters = this.state.filters;
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
    var filters = this.state.filters;
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
    var filters = this.state.filters;

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
  _handleSelectCondition: function(condition){
    var filters = this.state.filters
    if(filters.product_condition && filters.product_condition.value == condition.id){
      delete filters.product_condition;
    }else{
      filters.product_condition = {display_name: condition.title, value: condition.id}
    }
    this.setState({filters: filters});
    this.refs.timeline.filterAgain();
  },
  _handleSelectRating: function(rating){
    var filters = this.state.filters
    if(filters.rating && filters.rating.value == rating){
      delete filters.rating;
    }else{
      filters.rating = {display_name: (rating + ' ба түүнээс дээш үнэлгээтэй'), value: rating}
    }
    this.setState({filters: filters});
    this.refs.timeline.filterAgain();
  },
  _handleIsFreeCheck: function(){
    var filters = this.state.filters
    if(filters.is_free){
      delete filters.is_free;
    }else{
      filters.is_free = {display_name: 'Үнэгүй бараа', value: true}
    }
    this.setState({filters: filters});
    this.refs.timeline.filterAgain();
  },
  _handleChangeNumeric: function (e) {
    var v = parseInt(e.target.value);
    if((v > 0 && v.toString() == e.target.value) || e.target.value == ''){
      this.setState({[e.target.name]: v});
    }
  },
  _handleFilterPriceRange: function() {
    var filters = this.state.filters
    if(this.state.price_range_min && this.state.price_range_min != ''){
      delete filters.rating;
    }else{
      filters.rating = {display_name: (rating + ' ба түүнээс дээш үнэлгээтэй'), value: rating}
    }
    this.setState({filters: filters});
    this.refs.timeline.filterAgain();
  },
  render: function() {
    var condition_selector;
    if(!this.state.filters.top_level_cat || this.props.service_cat != this.state.filters.top_level_cat.value){
      condition_selector = (
        <div>
          <div className="left-filter-condition">
            <div className="title4">Төлөв</div>
            {this.props.p_conditions.map(function(condition,index) {
              return (
                <div key={index}>
                  <a onClick={this._handleSelectCondition.bind(null,condition)} className={this.state.filters.product_condition && this.state.filters.product_condition.value == condition.id ? "active" : ""} href="javascript:;">{condition.title}</a>
                </div>
              );
            }.bind(this))}
          </div>
          <div className="hairly-line"></div>
        </div>
      );
    }
    return (
      <div className="main">
        <div className="container">
          <div className="main-left">
            <div className="left-container">
              <div>
                {this.state.loaded && <CategorySelector categories={this.state.categories} filters={this.state.filters} handleSelectCat={this._handleSelectCat} />}
                <div className="hairly-line"></div>
                
                <div className="title5">Дэлгэрэнгүй хайлт</div>
                {condition_selector}
                <div className="left-filter-rank">
                  <div className="title4">Үнэлгээ</div>
                  <a href="javascript:;" onClick={this._handleSelectRating.bind(null,5)} className={this.state.filters.rating && this.state.filters.rating.value == 5 ? "active" : ""}>
                    <Rating rating={5} /> ба түүнээс дээш
                  </a>
                  <br/>                
                  <a href="javascript:;" onClick={this._handleSelectRating.bind(null,4)} className={this.state.filters.rating && this.state.filters.rating.value == 4 ? "active" : ""}>
                    <Rating rating={4} /> ба түүнээс дээш
                  </a>
                  <br/>
                  <a href="javascript:;" onClick={this._handleSelectRating.bind(null,3)} className={this.state.filters.rating && this.state.filters.rating.value == 3 ? "active" : ""}>
                    <Rating rating={3} /> ба түүнээс дээш
                  </a>
                  <br/>
                  <a href="javascript:;" onClick={this._handleSelectRating.bind(null,2)} className={this.state.filters.rating && this.state.filters.rating.value == 2 ? "active" : ""}>
                    <Rating rating={2} /> ба түүнээс дээш
                  </a>
                  <br/>
                  <a href="javascript:;" onClick={this._handleSelectRating.bind(null,1)} className={this.state.filters.rating && this.state.filters.rating.value == 1 ? "active" : ""}>
                    <Rating rating={1} /> ба түүнээс дээш
                  </a>
                </div>
                <div className="hairly-line"></div>
                <div className="left-filter-price">
                  {!this.state.filters.is_free && <div>
                    <div className="title4">Мөнгөн үнэлгээ <a href="#">[?]</a></div>
                    <a href="javascript:;"><span className="glyphicon glyphicon-menu-left"></span> Бүх үнэлгээ</a>
                    <div className="price-range">
                      <span>{"\u20AE"}</span>
                      <input type="text" className="form-control" name="price_range_min" value={this.state.price_range_min} onChange={this._handleChangeNumeric} />
                      <span>{" - \u20AE"}</span>
                      <input type="text" className="form-control" name="price_range_max" value={this.state.price_range_max} onChange={this._handleChangeNumeric} />
                      <span onClick={this._handleFilterPriceRange} className="glyphicon glyphicon glyphicon-search" />
                    </div>
                    <div className="clearfix"></div>
                  </div>}
                  <div className="checkbox">
                    <label>
                      <input type="checkbox" onChange={this._handleIsFreeCheck} checked={this.state.filters.is_free} /> Үнэгүй
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
          {this.state.loaded && <Timeline ref='timeline' current_user_id={this.props.current_user_id} filters={this.state.filters} handleRemoveFilter={this._handleRemoveFilter} service_cat={this.props.service_cat} />}
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