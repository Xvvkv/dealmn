var SearchBar = React.createClass({
  getInitialState: function () {
    return {categories: []};
  },
  componentDidMount: function() {
    this.loadDataFromServer();
  },
  componentDidUpdate: function() {
    $(".dropdown-menu li a").click(function(){
      var selText = $(this).text();
      $(this).parents('.input-group-btn').find('button[data-toggle="dropdown"]').html(selText+' <span class="caret"></span>');
    });
  },
  loadDataFromServer: function () {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function (categories) {
        this.setState({categories: categories});
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div className="header-side-search">
        <div className="input-group">
          <SearchBarCategory categories={this.state.categories} />
          <SearchBarInput />
          <span className="input-group-btn">
            <button className="btn btn-default" type="button">{I18n.search_bar.search}</button>
          </span>
        </div>
      </div>
    );
  }
});


var SearchBarCategory = React.createClass({
  render: function() {
    var items = this.props.categories.map(function (item, index) {
      return (
        <li key={index}><a href="javascript:;">{item.name}</a></li>
      );
    });
    return (
      <div className="input-group-btn">
        <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          {I18n.search_bar.all_category} <span className="caret"></span>
        </button>
        <ul className="dropdown-menu">
          <li><a href="javascript:;">{I18n.search_bar.all_category}</a></li>
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
      <input type="text" className="form-control" placeholder="" />
    );
  }
});


module.exports = SearchBar;
