var ListingItemButtons = React.createClass({
  handleCloseListing: function(e) {
    if (confirm('Тохиролцоог хааснаар санал хүлээж авах болон буцааж нээх боломжгүй болно. Үргэлжлүүлэх үү?')) {
      $(e.target).button('loading');

      $.ajax({
        url: '/rest/listings/' + this.props.listing.id + '.json',
        type: "delete",
        dataType: 'json',
        success: function () {
          $.growl.notice({ title: '', message: "Тохиролцоо хаагдлаа" , location: "br", delayOnHover: true});
          this.props.handleCloseListing(e);
        }.bind(this),
        error: function (xhr, status, err) {
          $.growl.error({ title: '', message: "Алдаа гарлаа" , location: "br", delayOnHover: true});
          console.error('/rest/listings.json', status, err.toString());
        }.bind(this),
        complete: function () {
          $(e.target).button('reset');
        }.bind(this)
      });
    } else {
      return;
    }
  },
  render: function(){
    var bid_button, pm_button, edit_button, close_button;
    if(this.props.listing.user){
      if(this.props.current_user_id != this.props.listing.user.id){
        bid_button = <a className="btn btn-primary" href={'/listings/' + this.props.listing.id + '/bids/new'}>Санал илгээх</a>
        pm_button = <a className="btn btn-success" href={'/listings/' + this.props.listing.id + '/bids/new'}><span className="glyphicon glyphicon-envelope" /></a>
      }else{
        edit_button = <a className="btn btn-warning" href={'/listings/' + this.props.listing.id + '/edit'}><span className="glyphicon glyphicon-edit" /></a>
        close_button = <a className="btn btn-danger" href="javascript:;" onClick={this.handleCloseListing}><span className="glyphicon glyphicon-remove" /></a>
      }
    }
    return (
      <div>
        {!this.props.is_closed && bid_button}
        {pm_button}
        {!this.props.is_closed && close_button}
        {!this.props.is_closed && edit_button}
      </div>
    );
  }
})

module.exports = ListingItemButtons;