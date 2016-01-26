var WishListItemButtons = React.createClass({
  getInitialState: function() {
    return {
      updating: false
    };
  },
  handleDelete: function(e) {
    if(this.state.updating){
      console.log('not finished yet!!!')
      return;
    }
    this.setState({updating: true})
    $.ajax({
      url: '/rest/wish_lists/' + this.props.item.id + '.json',
      type: "delete",
      dataType: 'json',
      success: function () {
        $.growl.notice({ title: '', message: "Дугуйлсан тохиролцоо устгагдлаа" , location: "br", delayOnHover: true});
        this.props.handleDeleteWishListItem(e);
      }.bind(this),
      error: function (xhr, status, err) {
        $.growl.error({ title: '', message: "Алдаа гарлаа" , location: "br", delayOnHover: true});
        console.error('/rest/listings.json', status, err.toString());
      }.bind(this),
      complete: function () {
        this.setState({updating: false})
      }.bind(this)
    });
  },
  render: function(){
    var bid_button = <a className="btn btn-primary" href={'/listings/' + this.props.item.listing.id + '/bids/new'}>Санал илгээх</a>
    var delete_button = <a className="btn btn-danger" href="javascript:;" onClick={this.handleDelete}>Устгах</a>
    return (
      <div>
        {!this.props.item.listing.is_closed && bid_button}
        {delete_button}
      </div>
    );
  }
})

module.exports = WishListItemButtons;