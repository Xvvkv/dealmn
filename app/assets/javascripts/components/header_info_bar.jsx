var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var TimerMixin = require('react-timer-mixin');

var HeaderInfoBar = React.createClass({
  mixins: [TimerMixin],
  getInitialState: function() {
    return {
      info_items: [],
      info_idx: -1,
    };
  },
  componentDidMount: function() {
    this.loadSiteStat();
  },
  loadSiteStat: function () {
    $.ajax({
      url: '/rest/site_stats/get_stat.json',
      dataType: 'json',
      success: function (site_stat) {
        var info_items = this.state.info_items;
        if(site_stat.listing_count_today > 0){
          info_items.push(<span>Нийт <strong>{site_stat.total_listing}</strong> тохиролцоо. Өнөөдөр <strong>{site_stat.listing_count_today}</strong> тохиролцоо орсон байна.</span>)
        }else{
          info_items.push(<span>Нийт <strong>{site_stat.total_listing}</strong> тохиролцоо орсон байна.</span>)
        }

        if(site_stat.total_accepted_bid > 0){
          info_items.push(<span>Нийт <strong>{site_stat.total_accepted_bid}</strong> удаа хэрэглэгчдийн хооронд тохиролцоо хийгдсэн байна.</span>);
        }
        
        this.setState({
          info_items: info_items,
        });
        this.loadLatestAcceptedBids();
      }.bind(this),
      error: function (xhr, status, err) {
        console.error('/rest/listings.json', status, err.toString());
      }.bind(this)
    });
  },
  loadLatestAcceptedBids: function () {
    $.ajax({
      url: '/rest/bids/latest_accepted_bids.json',
      dataType: 'json',
      success: function (bids) {
        var info_items = this.state.info_items;

        bids.forEach(function(bid) {
          info_items.push(<span>{bid.accepted_date}{"\u00a0\u00a0\u00a0"}<a href={'/users/' + bid.biddable.user_id}>{bid.biddable.user_name}</a>, <a href={'/users/'+bid.user.id}>{bid.user.display_name}</a> хэрэглэгч нарын хооронд <a href={'/listings/' + bid.biddable.id}>{bid.biddable.title}</a> тохиролцоо хийгдлээ</span>)
        });

        this.setState({
          info_items: info_items,
          info_idx: 0
        });

        this.setInterval(
          this.rotate,
          10000
        );
      }.bind(this),
      error: function (xhr, status, err) {
        console.error('/rest/listings.json', status, err.toString());
      }.bind(this)
    });
  },
  rotate: function() {
    var info_idx = this.state.info_idx;
    info_idx++;
    if(info_idx >= this.state.info_items.length)
      info_idx = 0;
    this.setState({info_idx: info_idx});
  },
  shuffleItems: function() {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
  },
  render: function() {
    return (
      <div className="header_info_bar">
        <ReactCSSTransitionGroup transitionName="slider" transitionEnterTimeout={300} transitionLeaveTimeout={1}>
          {this.state.info_idx != -1 && <div key={this.state.info_idx}>{this.state.info_items[this.state.info_idx]}</div>}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
});


module.exports = HeaderInfoBar;
