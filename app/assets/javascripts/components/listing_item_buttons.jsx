var ListingItemButtons = React.createClass({
  getInitialState: function() {
    return {
      updating: false
    };
  },
  handleCloseListing: function(e) {
    if(this.state.updating){
      console.log('not finished yet!!!')
      return;
    }
    if (confirm('Тохиролцоог хааснаар санал хүлээж авах болон буцааж нээх боломжгүй болно. Үргэлжлүүлэх үү?')) {
      this.setState({updating: true})

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
          this.setState({updating: false})
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
        pm_button = <a className="btn btn-success" href={'/users/' + this.props.current_user_id + '?p=send_msg&u=' + this.props.listing.user.id}><span className="glyphicon glyphicon-envelope" /></a>
      }else{
        edit_button = <a className="btn btn-warning" href={'/listings/' + this.props.listing.id + '/edit'}><span className="glyphicon glyphicon-edit" /></a>
        close_button = <a ref="close_button" className="btn btn-danger" href="javascript:;" onClick={this.handleCloseListing}><span className="glyphicon glyphicon-remove" /></a>
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