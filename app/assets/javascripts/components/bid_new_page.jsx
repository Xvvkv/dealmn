var ImageUpload = require('./image_upload.jsx');
var ContactInfo = require('./contact_info.jsx');
var FreeItemList = require('./free_item_list.jsx');
var ItemSelector = require('./item_selector.jsx');

var BidNewPage = React.createClass({
  getInitialState: function() {
    return {
      listings: []
    };
  },
  componentDidMount: function() {
    this.loadDataFromServer();
  },
  loadDataFromServer: function () {

    $.ajax({
      url: '/rest/listings.json',
      dataType: 'json',
      success: function (listings) {
        this.setState({
          listings: listings
        });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error('/rest/listings.json', status, err.toString());
      }.bind(this)
    });
  },
  _handleSelectItem: function(item) {
    this.refs.addBid._handleSelectListingItem(item); // using refs here is kind of not ideal solution. But this allows us to put every logic inside AddBid component
  },
  render: function() {
    var listing_selector;
    if(this.state.listings.length > 0){
      listing_selector = (
        <ItemSelector items={this.state.listings} onSelectItem={this._handleSelectItem} title="Тохиролцоонууд" hint="Сүүлд оруулсан тохиролцооны мэдээллээ санал илгээхэд ашиглах" />
      );
    }
    return (
      <div className="main">
        <div className="container">
          <AddBid ref="addBid" {...this.props} />
          <div className="main-right">
            {listing_selector}
            <FreeItemList />
          </div>
        </div>
      </div>
    );
  }
});

var AddBid = React.createClass({
  getInitialState: function() {
    return {
      images: [],
      bid: {},
      contacts: []
    };
  },
  componentDidMount: function() {
    this.loadDataFromServer();
  },
  loadDataFromServer: function () {
    $.ajax({
      url: '/rest/contacts.json',
      dataType: 'json',
      success: function (contacts) {
        this.setState({contacts: contacts});
      }.bind(this),
      error: function (xhr, status, err) {
        console.error('/rest/contacts.json', status, err.toString());
      }.bind(this)
    });

  },
  _handleImageAdd: function (image) {
    var images = this.state.images
    images.push(image);
    this.setState({images: images});
  },
  _handleImageDelete: function (image) {
    var images = this.state.images.filter(function(img){
      return img.id !== image.id;
    });

    this.setState({
      images: images
    });

  },
  _handleErrorMessage: function (message) {
    // TODO change this
    console.log(message);
  },
  _handleSubmit: function () {

    $(this.refs.postButton).button('loading');
    
    var data = {};
    data["images"] = this.state.images.map(function(image) { return image.id;});
    ["title","description","phone","email"].forEach(function(field) {
      data[field] = this.state[field]
    }.bind(this));

    $.ajax({
      url: '/rest/listings/' + this.props.listing.id + '/bids',
      type: "post",
      dataType: 'json',
      data: data,
      success: function (bid) {
        window.location = '/bids/' + bid.id;
      }.bind(this),
      error: function (xhr, status, err) {
        console.error('/rest/listings', status, err.toString());
        $.growl.error({ title: '', message: "Алдаа гарлаа" , location: "br", delayOnHover: true});
        $(this.refs.postButton).button('reset');
        window.scrollTo(0,0);
      }.bind(this)
    });
  },
  _handleChange: function (e) {
    this.setState({ [e.target.name]: e.target.value});
  },
  _handleContactItemClick: function (contact) {
    this.setState({phone: contact.phone, email: contact.email});
  },
  _handleSelectListingItem: function (item) {
    var flags = [], uniq_images = [], images = this.state.images.concat(item.images), l = images.length, i;
    for( i=0; i<l; i++) {
      if(flags[images[i].id]) continue;
      flags[images[i].id] = true;
      uniq_images.push(images[i]);
    }

    var changed_inputs = [];
    if(this.state.title != item.title){
      changed_inputs.push($(this.refs.title_input));
    }

    var new_description = item.text_description;

    if(item.specs.length > 0){
      new_description += '\n';
    }

    item.specs.forEach(function(spec) {
      new_description += ('\n' + spec.name + ': ' + spec.value);
    });
    new_description += ('\n\nhttp://localhost:3000/listings/' + item.id);

    if(this.state.description != new_description){
      changed_inputs.push($(this.refs.desc_input));
    }

    if(this.state.images.length < uniq_images.length){
      changed_inputs.push($(this.refs.imageUpload.refs.mainDiv));
    }

    changed_inputs.forEach(function(i) {
      i.effect("highlight", {}, 3000);
    });
    
    this.setState({title: item.title, description: new_description, images: uniq_images.slice(0,5)});
  
  },
  render: function() {
    return (
      <div className="add-deal-page">
        <div className="home-module-title big-title">{I18n.page.title}</div>
        <div className="form-group col-md-12">
          <label>{I18n.page.general_info.title} <a href="#">[?]</a> </label>
          <input name="title" ref="title_input" type="text" className="form-control" onChange={this._handleChange} value={this.state.title} /> 
        </div>
        <div className="col-md-12">
          <label>{I18n.page.general_info.image} <a href="#">[?]</a></label>
          <ImageUpload ref="imageUpload" url="/rest/images" images={this.state.images}
                onImageAdd={this._handleImageAdd}
                onImageDelete={this._handleImageDelete}
                onErrorMessage={this._handleErrorMessage} />
        </div>
        <div className="clearfix"></div>
        <div className="form-group col-md-12">
          <label>{I18n.page.general_info.description} <a href="#">[?]</a></label>
          <textarea ref="desc_input" name="description" className="form-control" rows="5" value={this.state.description} onChange={this._handleChange} />
        </div>
        <ContactInfo changeHandler={this._handleChange} phone={this.state.phone} email={this.state.email} contacts={this.state.contacts} handleContactItemClick={this._handleContactItemClick} />
        <div className="hairly-line"></div>
        <div className="col-md-12 text-center">
          <button ref="postButton" type="button" onClick={this._handleSubmit} className="btn btn-success">{I18n.page.bid}</button>
        </div>
      </div>
    );
  }
});

module.exports = BidNewPage;