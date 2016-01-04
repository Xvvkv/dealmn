var Breadcrumb = React.createClass({
  render: function() {
    return (
      <div className="breadcrumb-container">
        <div className="container">
          <ol className="breadcrumb">
            <li><a href="/">Нүүр</a></li>
            <li><a href="/">Бараа бүтээгдэхүүн</a></li>
            <li><a href="/">Цахилгаан бараа</a></li>
            <li><a href="/">Гар утас</a></li>
            <li className="active">Apple iPhone 5S GSM Factory Unlocked 16GB</li>
          </ol>
        </div>
      </div>
    );
  }
});

module.exports = Breadcrumb;

