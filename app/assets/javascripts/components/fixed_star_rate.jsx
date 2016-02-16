var FixedStarRate = React.createClass({
  getDefaultProps: function() {
    return {
      total: 5,
      rating: 0
    };
  },
  render: function() {
    var nodes = Array(this.props.total).join(',').split(',').map(function (_, i) {
      return (
        React.createElement("span", {className: (i >= this.props.total - this.props.rating) ? 'is-active': '',key: i}, "★")
      )
    }.bind(this));

    return (
      React.createElement("div", {className: "static-rating"}, nodes)
    );
  }
});

module.exports = FixedStarRate;