'use strict';

(function (root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(['react'], factory);
  } else if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory(require('react'));
  } else {
    root.Crop = factory(root.React);
  }

}(this, function (React) {

    var Crop = React.createClass({displayName: "Crop",
        $Crop : null ,
        propTypes: {
            onDblClick: React.PropTypes.func,
            onRelease: React.PropTypes.func
        },
        componentDidMount: function() {
            var self = this;

            // calculating initial selectbox position (center, square, max size to fit)
            var target = $(self.refs.reactCrop);
            var w = target.width();
            var h = target.height();
            var m = Math.min(h,w);
    
            target.Jcrop(self.props.options,function(){
                self.$Crop = this;
                self.setImage = self.$Crop.setImage;
                self.setOptions = self.$Crop.setOptions ;
                self.setSelect = self.$Crop.setSelect ;
                self.animateTo = self.$Crop.animateTo ;
                self.release = self.$Crop.release ;
                self.disable = self.$Crop.disable ;
                self.enable = self.$Crop.enable ;
                self.destroy = self.$Crop.destroy ;
                self.tellSelect = self.$Crop.tellSelect ;
                self.tellScaled = self.$Crop.tellScaled ;
                self.getBounds = self.$Crop.getBounds ;
                self.getWidgetSize = self.$Crop.getWidgetSize ;
                self.getScaleFactor= self.$Crop.getScaleFactor ;
            });
            self.setSelect([ w/2 - m/2, h/2 - m/2, w/2 + m/2, h/2 + m/2 ]);
        },
        componentWillUnmount : function(){
            this.$Crop.destroy();
        },
        render : function() {
            return (
                /*jshint ignore:start */
                React.createElement("div", {onWheel:  this.handleWheel}, React.createElement("img", {src:  this.props.src, ref: "reactCrop", onLoad: this.props._handleImageLoad}))
                /*jshint ignore:end */
            );
        }
    });
    
    return Crop;

}));