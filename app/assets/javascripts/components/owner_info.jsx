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
        <div className="home-module-title">{I18n.page.owner_info.title}</div>
        <div className="full-detail-user-info-short">
          <div className="full-detail-user-info-img"><img src={this.props.user.prof_pic ? this.props.user.prof_pic : '/images/no_avatar.png'} /></div>
          <div className="full-detail-user-info-name"><a href="#">{this.props.user.full_name}</a></div>
          <div className="full-detail-user-info-rate">
             {rater} <span>{(this.props.user.user_stat && this.props.user.user_stat.rating) ? ('(' + this.props.user.user_stat.rating + ')') : ''}</span>
            <div className="full-detail-user-info-raters">{I18n.page.owner_info.rated_by}: {this.props.user.user_stat ? this.props.user.user_stat.rating_count : ''}</div>
          </div>
          <div className="clearfix"></div>
          <div className="hairly-line"></div>
          <div className="full-detail-user-info-deals">
            <div className="full-detail-user-info-deals-reg"><span className="glyphicon glyphicon-calendar"></span> {I18n.page.owner_info.registered}: {this.props.user.registered_date}</div>
            <div className="full-detail-user-info-deals-all-deal"><span className="glyphicon glyphicon-tags"></span> {I18n.page.owner_info.total_listing}: {this.props.user.user_stat ? this.props.user.user_stat.total_listing : ''}</div>
            <div className="full-detail-user-info-deals-done-deal"><span className="glyphicon glyphicon-tags"></span> {I18n.page.owner_info.total_active_listing}: {this.props.user.user_stat ? this.props.user.user_stat.total_active_listing : ''}</div>
            <div className="full-detail-user-info-deals-active-deal"><span className="glyphicon glyphicon-ok"></span> {I18n.page.owner_info.total_accepted_bid}: {this.props.user.user_stat ? this.props.user.user_stat.total_accepted_bid : ''}</div>
            <div className="full-detail-user-info-deals-phone"><span className="glyphicon glyphicon-phone"></span> {I18n.page.owner_info.phone}: {this.props.user.primary_contact ? this.props.user.primary_contact.phone : ''}</div>
            <div className="full-detail-user-info-deals-email"><span className="glyphicon glyphicon-envelope"></span> {I18n.page.owner_info.email}: {this.props.user.primary_contact ? this.props.user.primary_contact.email : ''}</div>
            <div className="hairly-line"></div>
            <div className="text-center">
              <div className="btn btn-success" style={{width: '50%'}}>{I18n.page.owner_info.send_pm}</div>
            </div>
          </div>
        </div>
        <div className="clearfix"></div>
      </div>
    );
  }
});

module.exports = OwnerInfo;