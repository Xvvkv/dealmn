var ContactInfo = React.createClass({
  render: function() {
    var contacts = this.props.contacts.map(function(contact,index) {
      return (
        <ContactItem key={index} phone={contact.phone} email={contact.email} onClick={this.props.handleContactItemClick.bind(null,contact)} />
      );
    }.bind(this));
    var recent_contacts;
    if (contacts.length > 0){
      recent_contacts = (
        <div>
          <div className="col-md-12">
            <div className="title_information">{I18n.contact_info.reuse_recent_contacts}</div>
          </div>
          <div className="col-md-12">
            {contacts}
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className="col-md-12">
          <div className="home-module-title sub-title">{I18n.contact_info.section_title}</div>
        </div>
        {recent_contacts}
        <div className="form-group col-md-12">
          <label>{I18n.contact_info.phone} <a href="#">[?]</a></label>
          <input type="text" className="form-control half-width" placeholder={I18n.contact_info.phone_placeholder} name="phone" value={this.props.phone} onChange={this.props.changeHandler} />
        </div>
        <div className="form-group col-md-12">
          <label>{I18n.contact_info.email} <a href="#">[?]</a></label>
          <input type="text" className="form-control half-width" placeholder={I18n.contact_info.email_placeholder} name="email" value={this.props.email} onChange={this.props.changeHandler} />
        </div>
      </div>
    );
  }
});

var ContactItem = React.createClass({
  render: function() {
    return (
      <div className="prev-contact-info col-md-4" onClick={this.props.onClick} >
        {I18n.contact_info.phone_short}: {this.props.phone}<br/>
        {I18n.contact_info.email}: {this.props.email}
      </div>
    );
  }
});

module.exports = ContactInfo;