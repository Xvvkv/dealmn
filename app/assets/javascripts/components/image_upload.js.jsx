var ImageUpload = React.createClass({
  getDefaultProps: function() {
    return {
      jcrop_options: {
        allowSelect: false,
        aspectRatio: 1,
        minSize: [100,100],
        boxWidth: 500,
      },
      //additionalData: {},
      images: [],
      maxImages: 5
    };
  },
  getInitialState: function() {
    return {
      file: '',
      imagePreviewUrl: ''
    };
  },
  updateCrop: function(coords) {
    $(this.refs.crop_x).val(coords.x);
    $(this.refs.crop_y).val(coords.y);
    $(this.refs.crop_w).val(coords.w);
    $(this.refs.crop_h).val(coords.h);
  },
  _handleImageAdd: function(image) {
    this.props.onImageAdd(image);
  },
  _handleImageDelete: function() {
    this.props.onImageDelete();
  },
  _handleErrorMessage: function(message) {
    this.props.onErrorMessage(message);
  },
  _handleSubmit: function(e) {
    e.preventDefault();
    var data = new FormData();
    data.append("image",this.state.file);

    this.updateCrop(this.refs.crop.tellSelect());

    data.append("crop_x",$(this.refs.crop_x).val())
    data.append("crop_y",$(this.refs.crop_y).val())
    data.append("crop_w",$(this.refs.crop_w).val())
    data.append("crop_h",$(this.refs.crop_h).val())

//    for(var key in this.props.additionalData){
//      data.append(key,this.props.additionalData[key]);
//    }
    
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
        //TODO handle error...
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  _handleImageChange: function(e) {
    e.preventDefault();
    var reader = new FileReader();
    var file = e.target.files[0];
    var image = new Image();
    var err = false;
    reader.onload = function(_file) {
      image.src    = _file.target.result;              // url.createObjectURL(file);
      image.onload = function() {
        var w = image.width, h = image.height, s = file.size;
        if (w < 2000 || h < 2000 || s > 20*1024*1024){
          // TODO handle error...
          $.growl.error({ title: '', message: "Зургийн хэмжээ 200х200 пиксэлээс багагүй, файлын хэмжээ 20МВ-аас ихгүй байх хэрэгтэй" , location: "br", delayOnHover: true});
  
          console.log('min 200px, max 20mb');
        }else{
          this.setState({
            file: file,
            imagePreviewUrl: reader.result
          }); 
        }
      }.bind(this);
      image.onerror= function() {
        err = true;
        // TODO handle error...
        console.log('Invalid file type: '+ file.type);
      };
    }.bind(this);
    reader.readAsDataURL(file);
  },
  render: function() {
    var {imagePreviewUrl} = this.state;
    var imagePreview = null;
    var addImage = null;
    if (imagePreviewUrl) {
      imagePreview = (<Crop src={ imagePreviewUrl } options={ this.props.jcrop_options } ref="crop" />);
      addImage = (
          <div className="add-deal-add-pic-button">
            <form onSubmit={this._handleSubmit}>
              <input type="hidden" name="crop_x" ref="crop_x"/>
              <input type="hidden" name="crop_y" ref="crop_y"/>
              <input type="hidden" name="crop_w" ref="crop_w"/>
              <input type="hidden" name="crop_h" ref="crop_h"/>
              <button type="submit" onClick={this._handleSubmit}>Upload Image</button>
            </form>
          </div>);
    } else {
      if(this.props.images.length < this.props.maxImages){
        addImage = (
        <a href="#">
          <div className="add-deal-add-pic-button">
            <input type="file" onChange={this._handleImageChange} />
          </div>
        </a>);  
      }
    }

    return (
      <div className="add-deal-add-pictures">
        {this.props.images.map(function(image, index){
          return (
            <img src={image.thumb} key={index} />
          );
        })}
        {addImage}
        <div className="clearfix"></div>
        <div className="preview">
          {imagePreview}
        </div>
      </div>
    );
  }
});
