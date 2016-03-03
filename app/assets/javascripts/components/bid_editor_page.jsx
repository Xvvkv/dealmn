var ImageUpload = require('./image_upload.jsx');
var ContactInfo = require('./contact_info.jsx');
var FreeItemList = require('./free_item_list.jsx');
var ItemSelector = require('./item_selector.jsx');
var TosAgreement = require('./tos_agreement.jsx');

var BidEditorPage = React.createClass({
  getInitialState: function() {
    return {
      user: {},
      user_loaded: false,
      listings: []
    };
  },
  componentDidMount: function() {
    this.loadDataFromServer();
  },
  loadDataFromServer: function () {
    $.ajax({
      url: '/rest/users/' + this.props.current_user_id + '.json',
      dataType: 'json',
      success: function (user) {
        this.setState({
          user: user,
          user_loaded: true
        });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error('/rest/users.json', status, err.toString());
      }.bind(this)
    });

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
    this.refs.editor._handleSelectListingItem(item); // using refs here is kind of not ideal solution. But this allows us to put every logic inside AddBid component
  },
  _handleTosAgree: function() {
    var user = this.state.user;
    user.tos_agreed = true;
    this.setState({user: user});
  },
  render: function() {
    var listing_selector, tos_agreement;
    if(this.state.listings.length > 0){
      listing_selector = (
        <ItemSelector items={this.state.listings} onSelectItem={this._handleSelectItem} title="Тохиролцоонууд" hint="Сүүлд оруулсан тохиролцооны мэдээллээ санал илгээхэд ашиглах" />
      );
    }
    if(this.state.user_loaded && !this.state.user.tos_agreed){
      tos_agreement = (
        <div className="modal show" id="tosModal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-body">
                <TosAgreement current_user_id={this.props.current_user_id} user={this.state.user} handleAgree={this._handleTosAgree} />
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="main">
        <div className="container">
          <BidEditor ref="editor" {...this.props} />
          {tos_agreement}
          <div className="main-right">
            {listing_selector}
            <div className="right-banner">
              <a href="#"><img src='/images/banner1.png' /></a>
            </div>
            <FreeItemList />
          </div>
        </div>
      </div>
    );
  }
});

var BidEditor = React.createClass({
  getDefaultProps: function() {
    return {
      validation_rules: {
        'title' : {max: 70, min: 3, presence: true},
        'description' : {max: 5000},
        'email' : {max: 50},
        'phone' : {max: 50}
      }
    };
  },
  getInitialState: function() {
    return {
      images: [],
      bid: {},
      contacts: [],
      updating: false,
      validation_errors: {}
    };
  },
  componentDidMount: function() {
    this.loadDataFromServer();
  },
  loadDataFromServer: function () {
    if(this.props.edit_mode){
      $.ajax({
        url: '/rest/bids/' + this.props.bid_id + '.json',
        dataType: 'json',
        success: function (bid) {
          this.setState({
            bid: bid,
            images: bid.images,
            title: bid.title,
            description: bid.description,
            email: (bid.contact || {}).email,
            phone: (bid.contact || {}).phone
          });
        }.bind(this),
        error: function (xhr, status, err) {
          console.error('/rest/bids.json', status, err.toString());
        }.bind(this)
      });
    }

    $.ajax({
      url: '/rest/contacts.json',
      dataType: 'json',
      success: function (res) {
        this.setState({contacts: res.latest_contacts});
        if(!this.props.edit_mode){
          this.setState({
            email: (res.primary_contact || {}).email,
            phone: (res.primary_contact || {}).phone
          });
        }
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
  _handleImageValidationError: function (error_message) {
    var validation_errors = this.state.validation_errors;
    validation_errors['image_preview'] = error_message
    this.setState({validation_errors: validation_errors})
    console.log(error_message);
  },
  _clearImageValidationError: function () {
    var validation_errors = this.state.validation_errors;
    delete validation_errors['image_preview']
    this.setState({validation_errors: validation_errors})
  },
  _handleBid: function(){
    if(this.validate()){
      this._handleSubmit(0);
    }
  },
  _handleSave: function(){
    if(this.validate()){
      this._handleSubmit(1);
    }
  },
  validate: function() {
    var validation_errors = {};

    if(this.refs.imageUpload.state.imagePreviewUrl){
      validation_errors['image_preview'] = 'та зураг байршуулах товчийг дарж оруулна уу'
    }

    if(this.state.title == null || this.state.title.trim().length < 3){
      validation_errors['title'] = 'оруулна уу. Хамгийн багадаа 3 тэмдэгт'
    }

    if(Object.keys(validation_errors).length > 0){
      this.setState({validation_errors : validation_errors});
      window.scrollTo(0,0);
      return false;
    }else{
      return true;
    }
  },
  _handleSubmit: function (mode) {
    if(this.state.updating){
      console.log('not finished yet!!!')
      return;
    }
    this.setState({updating: true})

    var data = {};
    data["images"] = this.state.images.map(function(image) { return image.id;});
    ["title","description","phone","email"].forEach(function(field) {
      data[field] = this.state[field]
    }.bind(this));

    if(mode == 0){
      $.ajax({
        url: '/rest/listings/' + this.props.listing_id + '/bids',
        type: "post",
        dataType: 'json',
        data: data,
        success: function (bid) {
          window.location = '/bids/' + bid.id;
        }.bind(this),
        error: function (xhr, status, err) {
          console.error('/rest/listings', status, err.toString());
          $.growl.error({ title: '', message: "Алдаа гарлаа" , location: "br", delayOnHover: true});
        }.bind(this),
        complete: function () {
          this.setState({updating: false});
        }.bind(this)
      });

    }else if (mode == 1){
      $.ajax({
        url: '/rest/bids/' + this.props.bid_id,
        type: "put",
        dataType: 'json',
        data: data,
        success: function (bid) {
          window.location = '/bids/' + this.props.bid_id;
        }.bind(this),
        error: function (xhr, status, err) {
          console.error('/rest/listings', status, err.toString());
          $.growl.error({ title: '', message: "Алдаа гарлаа" , location: "br", delayOnHover: true});
        }.bind(this),
        complete: function () {
          this.setState({updating: false});
        }.bind(this)
      });
    }
  },
  _handleChange: function (e) {
    var value = e.target.value;
    if(this.props.validation_rules[e.target.name] && this.props.validation_rules[e.target.name].max && this.props.validation_rules[e.target.name].max < value.length){
      value = value.slice(0,this.props.validation_rules[e.target.name].max);
    }
    this.setState({[e.target.name]: value});

    if(e.target.name == 'title'){
      var validation_errors = this.state.validation_errors;
      if(validation_errors['title'] && value && value.trim().length >= 3){
        delete validation_errors['title']
        this.setState({validation_errors: validation_errors})
      }
    }
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
    new_description += ('\n\nhttp://deal.mn/listings/' + item.id);

    if(this.state.description != new_description){
      changed_inputs.push($(this.refs.desc_input));
    }

    if(this.state.images.length < uniq_images.length){
      changed_inputs.push($(this.refs.imageUpload.refs.mainDiv));
    }

    changed_inputs.forEach(function(i) {
      i.effect("highlight", {color: '#e6f6ff'}, 3000);
    });
    
    this.setState({title: item.title, description: new_description, images: uniq_images.slice(0,5)});
  
  },
  render: function() {
    var header_info = (
          <div className="bs-callout bs-callout-info" id="callout-helper-context-color-specificity">
            <h5>Та доорхи тохиролцоонд энэхүү саналыг илгээх гэж байна.</h5>
            <p><strong><a href={"/listings/" + this.props.listing_id}>{this.props.listing_name}</a></strong></p>
          </div>
        );
    return (
      <div className="add-deal-page">
        {<div className="home-module-title big-title">{I18n.page.title}</div>}
        {!this.props.edit_mode && header_info}
        {this.state.validation_errors && Object.keys(this.state.validation_errors).length > 0 && <div className="alert alert-danger" role="alert">{I18n.page.validation_error}</div>}
        <div className={this.state.validation_errors['title'] ? "form-group col-md-12 has-error" : "form-group col-md-12"}>
          <label className='control-label'>{I18n.page.general_info.title}</label>
          {this.state.validation_errors['title'] && <span className='has-error-span'> {this.state.validation_errors['title']}</span>}
          <input name="title" ref="title_input" type="text" className="form-control" onChange={this._handleChange} value={this.state.title} /> 
        </div>
        <div className={this.state.validation_errors['image_preview'] ? "form-group col-md-12 has-error" : "form-group col-md-12"}>
          <label className='control-label'>{I18n.page.general_info.image}</label>
          {this.state.validation_errors['image_preview'] && <span className='has-error-span'> {this.state.validation_errors['image_preview']}</span>}
          <ImageUpload ref="imageUpload" url="/rest/images" images={this.state.images}
                onImageAdd={this._handleImageAdd}
                onImageDelete={this._handleImageDelete}
                onValidationError={this._handleImageValidationError}
                onClearValidationError={this._clearImageValidationError} />
        </div>
        <div className="clearfix"></div>
        <div className="form-group col-md-12">
          <label>{I18n.page.general_info.description} <a href="#">[?]</a></label>
          <textarea ref="desc_input" name="description" className="form-control" rows="5" value={this.state.description} onChange={this._handleChange} />
        </div>
        <ContactInfo changeHandler={this._handleChange} phone={this.state.phone} email={this.state.email} contacts={this.state.contacts} handleContactItemClick={this._handleContactItemClick} />
        <div className="hairly-line"></div>
        <div className="col-md-12 text-center">
          {!this.props.edit_mode && <button onClick={this._handleBid} className="btn btn-success">{I18n.page.bid}</button>}
          {this.props.edit_mode && <button onClick={this._handleSave} className="btn btn-success">{I18n.page.save}</button>}
        </div>
      </div>
    );
  }
});

module.exports = BidEditorPage;