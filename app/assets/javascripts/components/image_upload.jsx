var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var Crop = require('./react_crop.js')
var EXIF = require('exif-js')

function base64ToArrayBuffer (base64) {
    base64 = base64.replace(/^data\:([^\;]+)\;base64,/gmi, '');
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

var ImageUpload = React.createClass({
  getDefaultProps: function() {
    return {
      jcrop_options: {
        allowSelect: false,
        aspectRatio: 1,
        minSize: [200,200]
      },
      //additionalData: {},
      images: [],
      maxImages: 5
    };
  },
  getInitialState: function() {
    return {
      file: '',
      imagePreviewUrl: '',
      originalWidth: 1,
      exifOrientation: 1,
      loading: false,
      uploading: false
    };
  },
  _handleImageAdd: function(image) {
    this.props.onImageAdd(image);
  },
  _handleImageDelete: function(image) {
    this.props.onImageDelete(image);
  },
  _handleCancelCrop: function() {
    this.setState({
      file: '',
      imagePreviewUrl: '',
      originalWidth: 1
    });
    this.props.onClearValidationError();
  },
  _handleSubmit: function(e) {
    
    if(this.state.uploading){
      console.log('not finished yet!!!')
      return;
    }
    this.setState({uploading: true})

    var $btn = $(e.target)
    $btn.button('loading');;


    var data = new FormData();
    data.append("image",this.state.file);

    var ratio = this.state.originalWidth / Math.min(this.state.originalWidth,750);

    var coords = this.refs.crop.tellSelect();

    data.append("crop_x",coords.x * ratio)
    data.append("crop_y",coords.y * ratio)
    data.append("crop_w",coords.w * ratio)
    data.append("crop_h",coords.h * ratio)
    
    $.ajax({
      url: this.props.url,
      data: data,
      type: 'POST',
      cache: false,
      dataType: 'json',
      processData: false,
      contentType: false,
      success: function (image) {
        this.setState({
          file: '',
          imagePreviewUrl: ''
        });
        this._handleImageAdd(image);
      }.bind(this),
      error: function (xhr, status, err) {
        $.growl.error({ title: '', message: "Алдаа гарлаа" , location: "br", delayOnHover: true});
        console.error(this.props.url, status, err.toString());
      }.bind(this),
      complete: function () {
        this.setState({ uploading: false});
        this.props.onClearValidationError();
        $btn.button('reset');
      }.bind(this)
    });
  },
  _handleCropLoad: function() {
    this.setState({ loading: false});
    this.props.onClearValidationError();
  },
  _handleImageChange: function(e) {
    e.preventDefault();

    if(this.state.loading){
      console.log('not finished yet!!!')
      return;
    }
    this.setState({ loading: true});

    var reader = new FileReader();
    var file = e.target.files[0];
    var image = new Image();
    reader.onload = function(_file) {
      //var exif = EXIF.readFromBinaryFile(base64ToArrayBuffer(_file.target.result));
      //if(exif && exif.Orientation){
      //  this.setState({exifOrientation : exif.Orientation})  
      //}

      image.src    = _file.target.result;
      image.onload = function() {
        var w = image.width, h = image.height, s = file.size;
        if (w < 200 || h < 200 || s > 5*1024*1024){
          this.props.onValidationError('Зургийн хэмжээ 200х200 пиксэлээс багагүй, файлын хэмжээ 5МВ-аас ихгүй байх хэрэгтэй');
          this.setState({ loading: false});
        }else{
          this.setState({
            file: file,
            imagePreviewUrl: reader.result,
            originalWidth: w
          });
        }
      }.bind(this);
      image.onerror= function() {
        this.setState({ loading: false});
        this.props.onValidationError('Та зургийн файл оруулна уу');
        console.log('Invalid file type: '+ file.type);
      }.bind(this);
    }.bind(this);

    reader.onerror = function() {
      $.growl.error({ title: '', message: "Алдаа гарлаа" , location: "br", delayOnHover: true});
      this.setState({loading: false});
    }.bind(this);

    reader.readAsDataURL(file);
  },
  render: function() {
    var imagePreviewUrl = this.state.imagePreviewUrl;
    var imagePreview, addImage, images;

    if (imagePreviewUrl){
      imagePreview = (
        <div>
          <div className="pic-upload-buttons">
            <button onClick={this._handleCancelCrop} className="btn btn-default">Цуцлах</button>
            <button data-loading-text="Уншиж байна..." onClick={this._handleSubmit} type="button" className="btn btn-primary">Зураг байршуулах</button>
          </div>
          <Crop _handleImageLoad={this._handleCropLoad} src={ imagePreviewUrl } options={ this.props.jcrop_options } ref="crop" />
          <div className="pic-upload-buttons">
            <button onClick={this._handleCancelCrop} className="btn btn-default">Цуцлах</button>
            <button data-loading-text="Уншиж байна..." onClick={this._handleSubmit} type="button" className="btn btn-primary">Зураг байршуулах</button>
          </div>
        </div>
      );
    }

    if(this.state.loading == true){
      addImage = (
        <div className="progress-photo" />
      );
    }else{
      if(this.props.images.length < this.props.maxImages){
        addImage = (
        <a href="#">
          <div className="upload-photo">
            <input type="file" onChange={this._handleImageChange} />
          </div>
        </a>);  
      }
    }
    
    images = (
      <ReactCSSTransitionGroup transitionName="fadeInOut" transitionEnterTimeout={300} transitionLeaveTimeout={200}>
        {this.props.images.map(function(image, index){
          return (
            <div key={index} className="added-picture" >
              <div onClick={this._handleImageDelete.bind(null,image)} className="delete-button-img"><span className="glyphicon glyphicon-remove"></span></div>
              <img src={image.thumb} />
            </div>
          );
        }.bind(this))}
      </ReactCSSTransitionGroup>
    );

    return (
      <div ref="mainDiv" className="add-deal-add-pictures">
        {!imagePreviewUrl && images}
        {!imagePreviewUrl && addImage}
        <div className="clearfix"></div>
        <div className="crop-pic">
          {imagePreview}
        </div>
        <div className="clearfix"></div>
      </div>
    );
  }
});

module.exports = ImageUpload;