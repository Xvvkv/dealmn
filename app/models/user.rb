class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,  
    :recoverable, :rememberable, :trackable, :validatable
        
  attr_accessible :email, :password, :password_confirmation, :remember_me, :first_name, :last_name
  
  validates :first_name,
    format: {
      with: /[[:alpha:] -]+$/,
      message: I18n.t('user.validations.name')
    },
    presence: true,
    length: { minimum:2, maximum: 100 },
    if: "!provider"
  
  validates :last_name,
    format: {
      with: /[[:alpha:] -]+$/,
      message: I18n.t('user.validations.name')
    },
    presence: true,
    length: { minimum:1, maximum: 100 },
    if: "!provider"
  

  before_validation :setup_names
  before_destroy :destroy_dependents

  after_create :create_dependents

  belongs_to :avatar, :class_name => 'Image', :foreign_key => :avatar_id

  has_one :user_stat

  has_many :contacts

  has_many :bids
  has_many :listings

  has_one :primary_contact, :class_name => "Contact", :conditions => { :is_primary => true } 

  delegate :rating, :rating_count, to: :user_stat

  def display_name
    return "#{self.last_name[0...1].upcase}.#{self.first_name.camelcase}" if self.last_name.present? && self.first_name.present?
    return self.first_name if self.first_name.present?
    return self.email
  end

  def full_name
    return "#{self.last_name} #{self.first_name}" if self.last_name.present? && self.first_name.present?
    return self.email
  end

  def prof_pic type=:thumb
    self.avatar.image.url(type) if self.avatar
  end

  private

  def setup_names
    self.first_name = (self.first_name || "").split(" ").join(" ")
    self.last_name = (self.last_name || "").split(" ").join(" ")
  end

  def destroy_dependents
    #TODO
  end

  def create_dependents
    UserStat.create(user_id: self.id)
    UserSetting.create(user_id: self.id)
  end

end
