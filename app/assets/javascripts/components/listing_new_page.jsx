var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

var ImageUpload = require('./image_upload.jsx');
var ContactInfo = require('./contact_info.jsx');
var FreeItemList = require('./free_item_list.jsx');
var ItemSelector = require('./item_selector.jsx');

var ListingNewPage = React.createClass({
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
      url: '/rest/bids.json',
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
    this.refs.addListing._handleSelectBidItem(item); // using refs here is kind of not ideal solution. But this allows us to put every logic inside AddListing component
  },
  render: function() {
    return (
      <div className="main">
        <div className="container">
          <AddListing ref="addListing" {...this.props} />
          <div className="main-right">
            <ItemSelector items={this.state.bids} onSelectItem={this._handleSelectItem} title="Саналууд" hint="Бусдад санал болгосон бараа, үйлчилгээний мэдээллээ тохиролцоонд ашиглах" />
            <FreeItemList />
          </div>
        </div>
      </div>
    );
  }
});

var AddListing = React.createClass({
  getDefaultProps: function() {
    return {
      //listingId: null,
    };
  },
  getInitialState: function() {
    return {
      images: [],
      categories: [],
      selectedCat: [-1,-1,-1],
      condition_id: 1,
      listing: {},
      spec_suggestions: {},
      specs: {},
      contacts: []
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
          selectedCat: listing.category,
          title: listing.title,
          text_description: listing.text_description,
          wanted_description: listing.wanted_description,
          condition_id: (((listing.item || {}).product_condition || {}).id || 1),
          condition_desc: (listing.item || {}).condition_description,
          images: listing.images,
          specs: listing.specs.reduce(function(specs, spec) { specs[spec.name] = spec; return specs; }, {}),
          email: (listing.contact || {}).email,
          phone: (listing.contact || {}).phone
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
  _handleErrorMessage: function (message) {
    // TODO change this
    console.log(message);
  },
  _handleSave: function () {

    $(this.refs.saveButton).button('loading');
    
    var data = {};
    data["category"] = this.state.selectedCat;
    data["images"] = this.state.images.map(function(image) { return image.id;});
    ["specs","phone","email","condition_desc","condition_id","wanted_description","text_description","title"].forEach(function(field) {
      data[field] = this.state[field]
    }.bind(this));

    $.ajax({
      url: '/rest/listings/' + this.props.listing_id,
      type: "put",
      dataType: 'json',
      data: data,
      success: function (listing) {
        $.growl.notice({ title: '', message: "Хадгалагдлаа" , location: "br", delayOnHover: true});
  
        console.log('UPDATED');
        //$(this.refs.saveButton).button('reset');
      }.bind(this),
      error: function (xhr, status, err) {
        console.error('/rest/listings', status, err.toString());
        $.growl.error({ title: '', message: "Алдаа гарлаа" , location: "br", delayOnHover: true});

        //$(this.refs.saveButton).button('reset');
      }.bind(this),
      complete: function () {
        $(this.refs.saveButton).button('reset');
        window.scrollTo(0,0);
      }.bind(this)
    });
  },
  _handleSubmit: function () {
    // set status to published
    this._handleSave();
    // redirect to show listing page
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
    }
  },
  _handleChange: function (e) {
    this.setState({ [e.target.name]: e.target.value});
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

    var new_description = item.description + '\n\nhttp://localhost:3000/bids/' + item.id;
    if(this.state.text_description != new_description){
      changed_inputs.push($(this.refs.desc_input));
    }

    if(this.state.images.length < uniq_images.length){
      changed_inputs.push($(this.refs.imageUpload.refs.mainDiv));
    }

    changed_inputs.forEach(function(i) {
      i.effect("highlight", {}, 3000);
    });
    

    this.setState({title: item.title, text_description: new_description, images: uniq_images.slice(0,5)});
  },
  render: function() {
    return (
      <div className="add-deal-page">
        <div className="home-module-title big-title">{I18n.page.title}</div>
        <div className="col-md-12">
          <div className="home-module-title sub-title">{I18n.page.general_info.section_title}</div>
        </div>
        <div className="form-group col-md-12">
          <label>{I18n.page.general_info.title}</label>
          <input name="title" ref="title_input" type="text" className="form-control" onChange={this._handleChange} value={this.state.title} />
        </div>
        <CategorySelector selectedCat={this.state.selectedCat} onSelectCategory={this._handleSelectCategory} categories={this.state.categories}/>
        {this.props.service_cat != this.state.selectedCat[0]
          && <ConditionSelector p_conditions={this.props.p_conditions} changeHandler={this._handleChange} condition_id={this.state.condition_id} condition_desc={this.state.condition_desc} />
        }
        <div className="col-md-12">
          <div className="home-module-title sub-title">{I18n.page.detailed_info.section_title}</div>
        </div>
        <div className="col-md-12">
          <label>{I18n.page.detailed_info.image} <a href="#">[?]</a></label>
          <ImageUpload ref="imageUpload" url="/rest/images" images={this.state.images}
                onImageAdd={this._handleImageAdd}
                onImageDelete={this._handleImageDelete}
                onErrorMessage={this._handleErrorMessage} />
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
        <div className="form-group col-md-12">
          <label>{I18n.page.wanted.title} <a href="#">[?]</a></label>
          <textarea name="wanted_description" className="form-control" rows="5" value={this.state.wanted_description} onChange={this._handleChange} placeholder={I18n.page.wanted.placeholder} />
        </div>
        <div className="hairly-line"></div>
        <div className="col-md-12 text-center">
          <button ref="saveButton" data-loading-text="Loading..." type="button" onClick={this._handleSave} className="btn btn-success">{I18n.page.save}</button>&nbsp;
          <button type="button" onClick={this._handleSubmit} className="btn btn-success">{I18n.page.publish}</button>
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
      leftCategory = <CategorySelectorItem level={1} onSelectCategory={this.selectHandler} className="col-md-4 padding_left_delete" header={I18n.page.general_info.category} items={leftItems} selected={this.props.selectedCat[0]}/>;
    }

    if (leftItems.length > 0 && this.props.selectedCat[0] > -1){
      leftItems.forEach(function (category) {
        if(category.id == this.props.selectedCat[0]){
          midItems = category.children;
        } 
      }.bind(this));
      midCategory = <CategorySelectorItem level={2} onSelectCategory={this.selectHandler} className="col-md-4" items={midItems} selected={this.props.selectedCat[1]}/>;
    }

    if (midItems.length > 0 && this.props.selectedCat[1] > -1){
      midItems.forEach(function (category) {
        if(category.id == this.props.selectedCat[1]){
          rightItems = category.children;
        } 
      }.bind(this));
      rightCategory = <CategorySelectorItem level={3} onSelectCategory={this.selectHandler} className="col-md-4 padding_right_delete" items={rightItems} selected={this.props.selectedCat[2]} />;
    }

    return (
      <div className="form-group col-md-12">
          {leftCategory} 
        <ReactCSSTransitionGroup transitionName="slideleft" transitionEnterTimeout={300} transitionLeaveTimeout={200}>
          {midCategory}
          {rightCategory}
        </ReactCSSTransitionGroup>
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
        <label>{this.props.header || "\u00a0"}</label>
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
                  <div className="form-group col-md-6">
                    <label htmlFor="addSpecName" className="control-label">{I18n.page.detailed_info.add_spec.name}:</label>
                    <input id="addSpecName" name="addSpecName" type="text" className="form-control" value={this.props.addSpecName} onChange={this.props.addSpecChangeHandler} />
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="addSpecValue" className="control-label">{I18n.page.detailed_info.add_spec.value}:</label>
                    <input id="addSpecValue" name="addSpecValue" type="text" className="form-control" value={this.props.addSpecValue} onChange={this.props.addSpecChangeHandler} />
                  </div>
                  <div className="clearfix"></div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-default" data-dismiss="modal">{I18n.page.detailed_info.add_spec.cancel}</button>
                  <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.props.addHandler}>{I18n.page.detailed_info.add_spec.add}</button>
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


module.exports = ListingNewPage;
