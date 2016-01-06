var ImageViewer = React.createClass({
  getInitialState: function() {
    return {
      selectedImage: 0
    };
  },
  _handleMouseEnter: function(index){
    this.setState({
      selectedImage: index
    });
  },
  render: function() {
    var thumbs;
    if(this.props.images){
      thumbs = (
        this.props.images.map(function(image, index){
          return (
            <img src={image.thumb} key={index} className={index == this.state.selectedImage ? 'active' : ''} 
              onMouseEnter={this._handleMouseEnter.bind(null,index)} />
          );
        }.bind(this))
      );
    }
    var image = <div className="full-detail-image-loader" />;
    if(this.props.images){
      image = <img src={this.props.images[this.state.selectedImage] ? this.props.images[this.state.selectedImage].url : '/images/1234.jpg'} />
    }
    return (
      <div className="full-detail-images">
        <div className="full-detail-image-slide">
          {image}
        </div>
        <div className="full-detail-image-thumb">
          {thumbs}
        </div>
      </div>
    );
  }
});

module.exports = ImageViewer;