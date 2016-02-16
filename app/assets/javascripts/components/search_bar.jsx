var PubSub = require('pubsub-js');

var SearchBar = React.createClass({
  getInitialState: function () {
    return {
      categories: {},
      search_text: '',
      selected_cat: -1
    };
  },
  componentDidMount: function() {
    this.loadDataFromServer();
    PubSub.subscribe('cat_selected', this._handleSelectCategoryEvent);
  },
  componentWillUnmount: function() {
    PubSub.unsubscribe('cat_selected');
  },
  loadDataFromServer: function () {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function (categories) {
        this.setState({
          categories: categories.reduce(function(categories, category) { categories[category.id] = category; return categories; }, {})
        });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  _handleSearchTextChange: function (e) {
    this.setState({search_text: e.target.value});
  },
  _handleSelectCategory: function (cat_id) {
    this.setState({selected_cat: cat_id});
  },
  _handleSelectCategoryEvent: function (event, cat_id){
    this.setState({selected_cat: cat_id});
  },
  _handleOnKeyPress: function (e) {
    if(e.charCode == 13){ // Enter key pressed
      this.doSearch();
    }
  },
  doSearch: function () {
    var url = '/listings?search_text=' + this.state.search_text;
    if(this.state.selected_cat != -1){
      url += ('&c=' + this.state.selected_cat);
    }
    window.location = url;
  },
  render: function() {
    return (
      <div className="header-side-search">
        <div className="input-group">
          <SearchBarCategory categories={this.state.categories} handleSelectCategory={this._handleSelectCategory} selected_cat={this.state.selected_cat} />
          <SearchBarInput handleSearchTextChange={this._handleSearchTextChange} handleOnKeyPress={this._handleOnKeyPress} search_text={this.state.search_text} />
          <span className="input-group-btn">
            <button onClick={this.doSearch} className="btn btn-default" type="button">{I18n.search_bar.search}</button>
          </span>
        </div>
      </div>
    );
  }
});


var SearchBarCategory = React.createClass({
  render: function() {
    var items = Object.keys(this.props.categories).map(function (cat_id, index) {
      return (
        <li key={index}><a href="javascript:;" onClick={this.props.handleSelectCategory.bind(null,this.props.categories[cat_id].id)}>{this.props.categories[cat_id].name}</a></li>
      );
    }.bind(this));
    return (
      <div className="input-group-btn">
        <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          {this.props.selected_cat == -1 ? I18n.search_bar.all_category : this.props.categories[this.props.selected_cat].name} <span className="caret"></span>
        </button>
        <ul className="dropdown-menu">
          <li><a href="javascript:;" onClick={this.props.handleSelectCategory.bind(null,-1)}>{I18n.search_bar.all_category}</a></li>
          <li role="separator" className="divider"></li>
          {items}
        </ul>
      </div>
    );
  }
});

var SearchBarInput = React.createClass({
  render: function() {
    return (
      <input type="text" className="form-control" value={this.props.search_text} onChange={this.props.handleSearchTextChange} onKeyPress={this.props.handleOnKeyPress} placeholder="Хайх үгээ бичнэ үү" />
    );
  }
});


module.exports = SearchBar;
