var ImageViewer = React.createClass({
  getDefaultProps: function() {
    return {
      images: []
    };
  },
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
    return (
      <div className="full-detail-images">
        <div className="full-detail-image-slide">
          <img src={this.props.images[this.state.selectedImage] ? this.props.images[this.state.selectedImage].url : '/images/1234.jpg'} />
        </div>
        <div className="full-detail-image-thumb">
          {this.props.images.map(function(image, index){
            return (
              <img src={image.thumb} key={index} className={index == this.state.selectedImage ? 'active' : ''} 
                onMouseEnter={this._handleMouseEnter.bind(null,index)} />
            );
          }.bind(this))}
        </div>
      </div>
    );
  }
});

module.exports = ImageViewer;