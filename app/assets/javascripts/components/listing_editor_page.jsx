var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

var ImageUpload = require('./image_upload.jsx');
var ContactInfo = require('./contact_info.jsx');
var FreeItemList = require('./free_item_list.jsx');
var LatestDealList = require('./latest_deal_list.jsx');
var ItemSelector = require('./item_selector.jsx');

var ListingEditorPage = React.createClass({
  getInitialState: function() {
    return {
      bids: []
    };
  },
  componentDidMount: function() {
    this.loadDataFromServer();
  },
  loadDataFromServer: function () {

    $.ajax({
      url: '/rest/bids.json?limit=5',
      dataType: 'json',
      success: function (bids) {
        this.setState({
          bids: bids
        });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error('/rest/bids.json', status, err.toString());
      }.bind(this)
    });
  },
  _handleSelectItem: function(item) {
    this.refs.editor._handleSelectBidItem(item); // using refs here is kind of not ideal solution. But this allows us to put every logic inside AddListing component
  },
  render: function() {
    var bid_selector;
    if(this.state.bids.length > 0){
      bid_selector = (
        <ItemSelector items={this.state.bids} onSelectItem={this._handleSelectItem} title="Саналууд" hint="Бусдад санал болгосон бараа, үйлчилгээний мэдээллээ тохиролцоонд ашиглах" />
      );
    }
    return (
      <div className="main">
        <div className="container">
          <ListingEditor ref="editor" {...this.props} />
          <div className="main-right">
            {bid_selector}
            <FreeItemList />
            <div className="right-banner">
              <a href="#"><img src='/images/bobby_banner.jpg' /></a>
            </div>
            <LatestDealList />
          </div>
        </div>
      </div>
    );
  }
});

var ListingEditor = React.createClass({
  getDefaultProps: function() {
    return {
      validation_rules: {
        'title' : {max: 70, min: 3, presence: true},
        'text_description' : {max: 5000},
        'wanted_description' : {max: 255},
        'condition_desc' : {max: 255},
        'email' : {max: 50},
        'phone' : {max: 50},
        'addSpecName' : {max: 50},
        'addSpecValue' : {max: 50},
        'price_range_min' : {max: 2000000000},
        'price_range_max' : {max: 2000000000}
      }
    };
  },
  getInitialState: function() {
    return {
      images: [],
      categories: [],
      selectedCat: [-1,-1,-1],
      condition_id: 1,
      listing: {},
      is_free_original_value: false,
      spec_suggestions: {},
      specs: {},
      contacts: [],
      updating: false,
      validation_errors: {}
    };
  },
  componentDidMount: function() {
    this.loadDataFromServer();
  },
  loadDataFromServer: function () {

    $.ajax({
      url: '/rest/listings/' + this.props.listing_id + '.json',
      dataType: 'json',
      success: function (listing) {
        this.setState({
          selectedCat: (listing.breadcrumb ? listing.breadcrumb.reduce(function(selectedCat, cat){ selectedCat.push(cat.id); return selectedCat; }, []) : [-1,-1,-1]),
          title: listing.title,
          text_description: listing.text_description,
          wanted_description: listing.wanted_description,
          condition_id: (((listing.item || {}).product_condition || {}).id || 1),
          condition_desc: (listing.item || {}).condition_description,
          images: listing.images,
          specs: listing.specs.reduce(function(specs, spec) { specs[spec.name] = spec; return specs; }, {}),
          email: (listing.contact || {}).email,
          phone: (listing.contact || {}).phone,
          is_free: listing.is_free,
          is_for_donation: listing.is_for_donation,
          is_free_original_value: listing.is_free,
          price_range_min: (listing.price_range_min || ''),
          price_range_max: (listing.price_range_max || '')
        });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error('/rest/listings.json', status, err.toString());
      }.bind(this)
    });

    $.ajax({
      url: '/rest/categories.json',
      dataType: 'json',
      success: function (categories) {
        this.setState({categories: categories});
      }.bind(this),
      error: function (xhr, status, err) {
        console.error('/rest/categories.json', status, err.toString());
      }.bind(this)
    });

    $.ajax({
      url: '/rest/contacts.json',
      dataType: 'json',
      success: function (res) {
        this.setState({contacts: res.latest_contacts});
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
    //this.setState((state) => { images: state.images.unshift(image) });
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
  updateListing: function (mode) {

    if(this.state.updating){
      console.log('not finished yet!!!')
      return;
    }
    this.setState({updating: true})
    
    var data = {};
    data["category"] = this.state.selectedCat[2];
    data["mode"] = mode
    data["images"] = this.state.images.map(function(image) { return image.id;});
    ["specs","phone","email","condition_desc","condition_id","text_description","title","is_free","is_for_donation"].forEach(function(field) {
      data[field] = this.state[field]
    }.bind(this));

    if(!this.state.is_free){
      ["wanted_description","price_range_max","price_range_min"].forEach(function(field) {
        data[field] = this.state[field]
      }.bind(this));
    }

    $.ajax({
      url: '/rest/listings/' + this.props.listing_id,
      type: "put",
      dataType: 'json',
      data: data,
      success: function (listing) {
        if (mode == 0){
          $.growl.notice({ title: '', message: "Хадгалагдлаа" , location: "br", delayOnHover: true});
        }else{
          window.location = '/listings/' + this.props.listing_id;
        }
      }.bind(this),
      error: function (xhr, status, err) {
        console.error('/rest/listings', status, err.toString());
        $.growl.error({ title: '', message: "Алдаа гарлаа" , location: "br", delayOnHover: true});
      }.bind(this),
      complete: function () {
        this.setState({updating: false});
        window.scrollTo(0,0);
      }.bind(this)
    });
  },
  _handleSaveDraft: function () {
    this.updateListing(0);
  },
  _handleSubmit: function () {
    if(this.validate()){
      this.updateListing(1);
    }
  },
  _handleUpdate: function () {
    if(this.validate()){
      if (this.state.is_free_original_value === false && this.state.is_free){
        if (confirm('Та тохиролцоог ' + (this.state.is_for_donation ? 'сайн үйлсийн аян хандивлах' : 'бусдад үнэгүй өгөх') + ' болгож өөрчлөх гэж байна. Өөрчлөлтөөс өмнө ирсэн саналууд устах болно. Үргэлжлүүлэх үү?')) {
          this.updateListing(2);
        }
      }else{
        this.updateListing(2);
      }
    }
  },
  validate: function() {
    var validation_errors = {};

    if(this.refs.imageUpload.state.imagePreviewUrl){
      validation_errors['image_preview'] = 'та зураг байршуулах товчийг дарж оруулна уу'
    }

    if(!this.state.is_free && this.state.price_range_max !== '' && this.state.price_range_min !== ''){
      if(this.state.price_range_min > this.state.price_range_max){
        validation_errors['price_range'] = 'доод үнэлгээний хэмжээ дээд үнэлгээний хэмжээнээс их байж болохгүй'
      }
    }

    if(this.state.title == null || this.state.title.trim().length < 3){
      validation_errors['title'] = 'оруулна уу. Хамгийн багадаа 3 тэмдэгт'
    }

    if(this.state.selectedCat[2] <= 0){
      validation_errors['category'] = 'сонгоно уу';
    }

    if(Object.keys(validation_errors).length > 0){
      this.setState({validation_errors : validation_errors});
      window.scrollTo(0,0);
      return false;
    }else{
      return true;
    }
  },
  _handleSelectCategory: function (level, e) {
    if(level == 1){
      this.setState({
        selectedCat: [e.target.value,-1,-1]
      });
    }else if(level == 2){
      var tmp = this.state.selectedCat
      this.setState({
        selectedCat: [tmp[0],e.target.value,-1]
      });
    }else{
      $.ajax({
        url: '/rest/categories/' + e.target.value + '.json?include_spec_suggestions=true',
        dataType: 'json',
        success: function (category) {
          this.setState({spec_suggestions: category.spec_suggestions.reduce(function(specs, spec) { specs[spec.name] = spec; return specs; }, {})});
        }.bind(this),
        error: function (xhr, status, err) {
          console.error('/rest/categories.json', status, err.toString());
        }
      });

      var tmp = this.state.selectedCat
      this.setState({
        selectedCat: [tmp[0],tmp[1],e.target.value]
      });

      var validation_errors = this.state.validation_errors;
      if(validation_errors['category'] && e.target.value > -1){
        delete validation_errors['category']
        this.setState({validation_errors: validation_errors})
      }
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
  _handleChangePriceRange: function (e) {
    var v = '';
    if(e.target.value == ''){
      this.setState({[e.target.name]: e.target.value});
    }else{
      v = parseInt(e.target.value);
      
      if(v.toString() == e.target.value && v >=0 &&
        (!this.props.validation_rules[e.target.name] || !this.props.validation_rules[e.target.name].max || this.props.validation_rules[e.target.name].max >= v)){
        this.setState({[e.target.name]: v});
      }
    }

    var validation_errors = this.state.validation_errors;
    if(validation_errors['price_range']){
      if(e.target.name == 'price_range_min'){
        if(this.state.is_free || this.state.price_range_max === '' || v === '' || v <= this.state.price_range_max){
          delete validation_errors['price_range']
          this.setState({validation_errors: validation_errors})
        }
      }else {
        if(this.state.is_free || v === '' || this.state.price_range_min === '' || this.state.price_range_min <= v){
          delete validation_errors['price_range']
          this.setState({validation_errors: validation_errors})
        }
      }
    }
  },
  _handleIsFreeCheck: function (is_for_donation) {
    console.log(is_for_donation)
    if(is_for_donation){
      var old = this.state.is_for_donation;
      this.setState({is_free: !old, is_for_donation: !old})
    }else{
      var old = this.state.is_free && !this.state.is_for_donation;
      this.setState({is_free: !old, is_for_donation: false})
    }
  },
  _handleSpecChange: function (e) {
    var specs = this.state.specs;
    var spec = {name: e.target.name, value: e.target.value, placeholder: ''};
    
    if(spec.name in this.state.spec_suggestions){
      spec['placeholder'] = this.state.spec_suggestions[spec.name]['placeholder'];
    }
    specs[spec.name] = spec;
    this.setState({ specs: specs});  
  },
  _handleSpecAdd: function () {
    if(this.state.addSpecName && this.state.addSpecName.trim() !== ''){
      var specs = this.state.specs;
      var spec = {name: this.state.addSpecName, value: this.state.addSpecValue};
      specs[spec.name] = spec;
      this.setState({ specs: specs, addSpecName: '', addSpecValue: ''});
    }
  },
  _handleSpecRemove: function (spec) {
    var specs = this.state.specs;
    var spec_suggestions = this.state.spec_suggestions;
    delete specs[spec.name]
    delete spec_suggestions[spec.name]
    this.setState({ specs: specs, spec_suggestions: spec_suggestions});  
  },
  _handleContactItemClick: function (contact) {
    this.setState({phone: contact.phone, email: contact.email});
  },
  _handleSelectBidItem: function (item) {
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

    var new_description = item.description + '\n\nhttp://deal.mn/bids/' + item.id;
    if(this.state.text_description != new_description){
      changed_inputs.push($(this.refs.desc_input));
    }

    if(this.state.images.length < uniq_images.length){
      changed_inputs.push($(this.refs.imageUpload.refs.mainDiv));
    }

    changed_inputs.forEach(function(i) {
      i.effect("highlight", {color: '#e6f6ff'}, 3000);
    });
    

    this.setState({title: item.title, text_description: new_description, images: uniq_images.slice(0,5)});
  },
  render: function() {

    var free_item_section = (
      <div className="free-item-section col-md-12">
        <div className="free-item-checkbox">
          <label>
            <input type="checkbox" onChange={this._handleIsFreeCheck.bind(null,false)} checked={this.state.is_free && !this.state.is_for_donation}/> {I18n.page.wanted.free_item} <a href="#" data-tooltip={I18n.page.wanted.free_item_tooltip}>[?]</a>
          </label>
        </div>
        <div className="free-item-checkbox">
          <label>
            <input type="checkbox" onChange={this._handleIsFreeCheck.bind(null,true)} checked={this.state.is_free && this.state.is_for_donation}/> {I18n.page.wanted.for_donation} <a href="#" data-tooltip={I18n.page.wanted.for_donation_tooltip}>[?]</a>
          </label>
        </div>
      </div>
    );

    var price_range_section = (
      <div className={this.state.validation_errors['price_range'] ? "form-group col-md-12 has-error" : "form-group col-md-12"}>
        <label className="control-label">{I18n.page.wanted.price_range} <a href="#" data-tooltip={I18n.page.wanted.price_range_tooltip}>[?]</a></label>
        {this.state.validation_errors['price_range'] && <span className="has-error-span"> {this.state.validation_errors['price_range']}</span>}
        <div className="col-md-12 add-deal-price-range">
          <span>{"\u20AE"}</span>
          <input name="price_range_min" value={this.state.price_range_min} onChange={this._handleChangePriceRange} type="text" className="form-control " />
          <span>{" - \u20AE"}</span>
          <input name="price_range_max" value={this.state.price_range_max} onChange={this._handleChangePriceRange} type="text" className="form-control " />
        </div>
      </div>
    );
    var wanted_section = (
      <div className="form-group col-md-12">
        <label>{I18n.page.wanted.wanted_product} <a href="#" data-tooltip={I18n.page.wanted.wanted_product_tooltip}>[?]</a></label>
        <textarea name="wanted_description" className="form-control" rows="5" value={this.state.wanted_description} onChange={this._handleChange} placeholder={I18n.page.wanted.wanted_product_placeholder} />
      </div>
    );
    return (
      <div className="add-deal-page">
        <div className="home-module-title big-title">{I18n.page.title}</div>
        {this.state.validation_errors && Object.keys(this.state.validation_errors).length > 0 && <div className="alert alert-danger" role="alert">{I18n.page.validation_error}</div>}
        <div className="col-md-12">
          <div className="home-module-title sub-title">{I18n.page.general_info.section_title}</div>
        </div>
        <div className={this.state.validation_errors['title'] ? "form-group col-md-12 has-error" : "form-group col-md-12"}>
          <label className='control-label'>{I18n.page.general_info.title}</label>
          {this.state.validation_errors['title'] && <span className='has-error-span'> {this.state.validation_errors['title']}</span>}
          <input name="title" ref="title_input" type="text" className="form-control" onChange={this._handleChange} value={this.state.title} />
        </div>
        <CategorySelector selectedCat={this.state.selectedCat} onSelectCategory={this._handleSelectCategory} categories={this.state.categories} validation_error={this.state.validation_errors['category']}/>
        {this.props.service_cat != this.state.selectedCat[0]
          && <ConditionSelector p_conditions={this.props.p_conditions} changeHandler={this._handleChange} condition_id={this.state.condition_id} condition_desc={this.state.condition_desc} />
        }
        <div className="col-md-12">
          <div className="home-module-title sub-title">{I18n.page.detailed_info.section_title}</div>
        </div>
        <div className={this.state.validation_errors['image_preview'] ? "form-group col-md-12 has-error" : "form-group col-md-12"}>
          <label className='control-label'>{I18n.page.detailed_info.image}</label>
          {this.state.validation_errors['image_preview'] && <span className='has-error-span'> {this.state.validation_errors['image_preview']}</span>}
          <ImageUpload ref="imageUpload" url="/rest/images" images={this.state.images}
                onImageAdd={this._handleImageAdd}
                onImageDelete={this._handleImageDelete}
                onValidationError={this._handleImageValidationError}
                onClearValidationError={this._clearImageValidationError} />
        </div>
        <div className="clearfix"></div>
        <div className="form-group col-md-12">
          <label>{I18n.page.detailed_info.description} <a href="#">[?]</a></label>
          <textarea ref="desc_input" name="text_description" className="form-control" rows="5" value={this.state.text_description} onChange={this._handleChange} />
        </div>
        <SpecEditor items={$.extend({},this.state.spec_suggestions,this.state.specs)} changeHandler={this._handleSpecChange} addSpecChangeHandler={this._handleChange} addSpecName={this.state.addSpecName} addSpecValue={this.state.addSpecValue} removeHandler={this._handleSpecRemove} addHandler={this._handleSpecAdd} />
        <ContactInfo changeHandler={this._handleChange} phone={this.state.phone} email={this.state.email} contacts={this.state.contacts} handleContactItemClick={this._handleContactItemClick} />
        <div className="col-md-12">
          <div className="home-module-title sub-title">{I18n.page.wanted.section_title}</div>
        </div>
        {free_item_section}
        {!this.state.is_free && price_range_section}
        {!this.state.is_free && wanted_section}
        <div className="hairly-line"></div>
        <div className="col-md-12 text-center">
          {!this.props.edit_mode && <button onClick={this._handleSaveDraft} className="btn btn-success">{I18n.page.save}</button>}
          {!this.props.edit_mode && <button onClick={this._handleSubmit} className="btn btn-success">{I18n.page.publish}</button>}
          {this.props.edit_mode && <button onClick={this._handleUpdate} className="btn btn-success">{I18n.page.save}</button>}
        </div>
      </div>
    );
  }
});

var ConditionSelector = React.createClass({
  render: function() {
    var descriptionField;
    if(this.props.condition_id != 1){
      descriptionField = (
        <div className="form-group col-md-12">
          <label>{I18n.page.general_info.condition_desc} <a href="#">[?]</a></label>
          <textarea name="condition_desc" className="form-control" rows="3" value={this.props.condition_desc} onChange={this.props.changeHandler} />
        </div>
      )
    }
    return (
      <div>
        <div className="form-group col-md-12">
          <label>{I18n.page.general_info.condition} <a href="#">[?]</a></label>
          <select name="condition_id" value={this.props.condition_id} className="form-control auto_width" onChange={this.props.changeHandler}>
            {this.props.p_conditions.map(function(condition,index) {
              return (
                <option value={condition.id} key={index}>{condition.title}</option>
              );
            })}
          </select>
        </div>
        <ReactCSSTransitionGroup transitionName="fadeInOut" transitionEnterTimeout={300} transitionLeaveTimeout={200}>
          {descriptionField}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
});

var CategorySelector = React.createClass({
  getDefaultProps: function() {
    return {
      //listingId: null,
    };
  },
  selectHandler: function(level, e) {
    this.props.onSelectCategory(level, e);
  },
  render: function() {
    var leftCategory, midCategory, rightCategory;
    var leftItems = [], midItems = [], rightItems = [];

    if (this.props.categories.length > 0){
      leftItems = this.props.categories;
      leftCategory = <CategorySelectorItem level={1} onSelectCategory={this.selectHandler} className={this.props.validation_error && this.props.selectedCat[0] == -1 ? "col-md-4 padding_left_delete has-error" : "col-md-4 padding_left_delete"} items={leftItems} selected={this.props.selectedCat[0]} validation_error={this.props.validation_error} />;
    }

    if (leftItems.length > 0 && this.props.selectedCat[0] > -1){
      leftItems.forEach(function (category) {
        if(category.id == this.props.selectedCat[0]){
          midItems = category.children;
        } 
      }.bind(this));
      midCategory = <CategorySelectorItem level={2} onSelectCategory={this.selectHandler} className={this.props.validation_error && this.props.selectedCat[1] == -1 ? "col-md-4 has-error" : "col-md-4"} items={midItems} selected={this.props.selectedCat[1]}/>;
    }

    if (midItems.length > 0 && this.props.selectedCat[1] > -1){
      midItems.forEach(function (category) {
        if(category.id == this.props.selectedCat[1]){
          rightItems = category.children;
        } 
      }.bind(this));
      rightCategory = <CategorySelectorItem level={3} onSelectCategory={this.selectHandler} className={this.props.validation_error && this.props.selectedCat[2] == -1 ? "col-md-4 padding_right_delete has-error" : "col-md-4 padding_right_delete"} items={rightItems} selected={this.props.selectedCat[2]} />;
    }

    return (
      <div className="form-group col-md-12">
        <div className={this.props.validation_error ? "has-error" : ""}>
          <label className='control-label'>{I18n.page.general_info.category}</label>
          {this.props.validation_error && <span className='has-error-span'> {this.props.validation_error}</span>}
        </div>
        <div>
          {leftCategory} 
        <ReactCSSTransitionGroup transitionName="slideleft" transitionEnterTimeout={300} transitionLeaveTimeout={200}>
          {midCategory}
          {rightCategory}
        </ReactCSSTransitionGroup>
        </div>
      </div>
    );
  }
});

var CategorySelectorItem = React.createClass({
  changeHandler: function(e) {
    this.props.onSelectCategory(this.props.level, e);
  },
  render: function() {
    return (
      <div className={this.props.className}>
        <select value={this.props.selected} onChange={this.changeHandler} className="form-control">
          <option value={-1} key={-1}>{I18n.page.general_info.choose_category}</option>
          {this.props.items.map(function(item,index) {
            return (
              <option value={item.id} key={index}>{item.name}</option>
            );
          })}
        </select>
      </div>
    );
  }
});


var SpecEditor = React.createClass({
  getInitialState: function() {
    return {
      validation_error: null
    };
  },
  addHandler: function() {
    if(this.props.addSpecName && this.props.addSpecName.trim() !== ''){
      $('#addSpecModal').modal('hide');
      this.setState({validation_error: null})
      this.props.addHandler();
    }else{
      this.setState({validation_error: 'утга оруулна уу'})
    }
  },
  render: function() {
    var items = Object.keys(this.props.items).map(function(name,index) {
        return (
          <SpecItem key={index} item={this.props.items[name]} changeHandler={this.props.changeHandler} removeHandler={this.props.removeHandler}  />
        );
      }.bind(this));
    return (
      <div>
        {items}
        <div className="form-group col-md-12">
          <button type="button" className="btn btn-primary btn-sm" data-toggle="modal" data-target="#addSpecModal">
            {I18n.page.detailed_info.add_spec.title}
          </button>
          <div className="modal fade" id="addSpecModal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                  <h4 className="modal-title" id="myModalLabel">{I18n.page.detailed_info.add_spec.title}</h4>
                </div>
                <div className="modal-body">
                  <div className={this.state.validation_error ? "form-group col-md-6 has-error" : "form-group col-md-6"}>
                    <label htmlFor="addSpecName" className="control-label">{I18n.page.detailed_info.add_spec.name}</label>
                    {this.state.validation_error && <span className="has-error-span"> {this.state.validation_error}</span>}
                    <input id="addSpecName" name="addSpecName" type="text" className="form-control" value={this.props.addSpecName} onChange={this.props.addSpecChangeHandler} />
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="addSpecValue" className="control-label">{I18n.page.detailed_info.add_spec.value}</label>
                    <input id="addSpecValue" name="addSpecValue" type="text" className="form-control" value={this.props.addSpecValue} onChange={this.props.addSpecChangeHandler} />
                  </div>
                  <div className="clearfix"></div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-default" data-dismiss="modal">{I18n.page.detailed_info.add_spec.cancel}</button>
                  <button type="button" className="btn btn-primary" onClick={this.addHandler}>{I18n.page.detailed_info.add_spec.add}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

var SpecItem = React.createClass({
  render: function() {
    return (
      <div className="form-group col-md-12">
        <label>{this.props.item.name} <a href="javascript:;" onClick={this.props.removeHandler.bind(null,this.props.item)}>[{I18n.page.detailed_info.remove_spec}]</a></label>
        <input name={this.props.item.name} type="text" className="form-control half-width" onChange={this.props.changeHandler} value={this.props.item.value} placeholder={this.props.item.placeholder} />
      </div>
    );
  }
});


module.exports = ListingEditorPage;
