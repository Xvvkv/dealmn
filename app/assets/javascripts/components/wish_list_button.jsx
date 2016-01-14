var WishListButton = React.createClass({
  handleWishList: function(id, e){  
    if(e.target.tagName == 'SPAN'){
      return;
    }
    this.props.handleWishList(id);
    
    $.ajax({
      url: '/rest/wish_lists',
      type: "post",
      dataType: 'json',
      data: {listing_id: id},
      success: function (wl) {
        $.growl.notice({ title: '', message: "Тохиролцоо амжилттай дугуйлагдлаа" , location: "br", delayOnHover: true});
      }.bind(this),
      error: function (xhr, status, err) {
        console.error('/rest/listings', status, err.toString());
        $.growl.error({ title: '', message: "Алдаа гарлаа" , location: "br", delayOnHover: true});
        this.props.handleRevertWishList(id);
      }.bind(this)
    });
  },
  render: function(){
    var wish_list_button = <div style={{display: 'none'}} />;
    if(this.props.current_user_id != this.props.listing.user.id && !this.props.is_closed){
      if(!this.props.wish_listed){
        wish_list_button = (
          <div onClick={this.handleWishList.bind(null,this.props.listing.id)} className="checkbox btn btn-default">
            <label>
              <input type="checkbox" /> Дугуйлах
            </label>
          </div>
        );
      }else{
        wish_list_button = (
          <div className="wish-listed">Дугуйлагдсан</div>
        ); 
      }
    }
    return wish_list_button;
  }
})

module.exports = WishListButton;