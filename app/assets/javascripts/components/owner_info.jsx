var Rater = require('react-rater');
var Rating = require('./fixed_star_rate.jsx');

var OwnerInfo = React.createClass({
  render: function() {
    var rater
    if(this.props.loaded){
      if(this.props.user.id != this.props.current_user_id){
        rater = this.props.rating ? <Rating rating={Math.round(this.props.rating)}/> : <Rater onRate={this.props.handleRate}/>;
      }else{
        rater = <Rating rating={Math.round(this.props.user.user_stat.rating)} />
      }
    }
    return (
      <div className="full-detail-user-information">
        {this.props.title && <div className="home-module-title">{this.props.title}</div>}
        <div className="full-detail-user-info-short">
          <div className="full-detail-user-info-img"><img src={this.props.user.prof_pic ? this.props.user.prof_pic : '/images/no_avatar.png'} /></div>
          <div className="full-detail-user-info-name"><a href={'/users/' + this.props.user.id}>{this.props.user.full_name}</a></div>
          <div className="full-detail-user-info-rate">
             {rater} <span>{(this.props.user.user_stat && this.props.user.user_stat.rating) ? ('(' + this.props.user.user_stat.rating + ')') : ''}</span>
            <div className="full-detail-user-info-raters">{I18n.user_info.rating_count}: {this.props.user.user_stat ? this.props.user.user_stat.rating_count : ''}</div>
          </div>
          <div className="clearfix"></div>
          <div className="hairly-line"></div>
          <div className="full-detail-user-info-deals">
            <div className="full-detail-user-info-deals-reg"><span className="glyphicon glyphicon-calendar"></span> {I18n.user_info.registered}: {this.props.user.registered_date}</div>
            <div className="full-detail-user-info-deals-all-deal"><span className="glyphicon glyphicon-tags"></span> {I18n.user_info.total_listing}: {this.props.user.user_stat ? this.props.user.user_stat.total_listing : ''}</div>
            <div className="full-detail-user-info-deals-done-deal"><span className="glyphicon glyphicon-tags"></span> {I18n.user_info.total_active_listing}: {this.props.user.user_stat ? this.props.user.user_stat.total_active_listing : ''}</div>
            <div className="full-detail-user-info-deals-active-deal"><span className="glyphicon glyphicon-ok"></span> {I18n.user_info.total_accepted_bid}: {this.props.user.user_stat ? this.props.user.user_stat.total_accepted_bid : ''}</div>
            {!this.props.exclude_pm_button && <div className="hairly-line"></div>}
            {!this.props.exclude_pm_button && this.props.user.id != this.props.current_user_id && 
              <div className="text-center">
                <a className="btn btn-success" href={'/users/' + this.props.current_user_id + '?p=send_msg&u=' + this.props.user.id} style={{width: '50%'}}>{I18n.user_info.send_pm}</a>
              </div>
            }
          </div>
        </div>
        <div className="clearfix"></div>
      </div>
    );
  }
});

module.exports = OwnerInfo;