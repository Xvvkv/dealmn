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

  has_one :user_stat

  delegate :rating, :rating_count, to: :user_stat

  def display_name
    #TODO improve
    self.full_name || self.first_name
  end

  def full_name
    #TODO improve
    self.first_name + ' ' + self.last_name
  end

  def avatar type
    if self.avatar
      self.avatar.image.url(type)
    else
      Image.find(Image::DEFAULT_AVATAR_ID).image.url(type)
    end
  end

  private

  def setup_names
    self.first_name = (self.first_name || "").split(" ").join(" ")
    self.last_name = (self.last_name || "").split(" ").join(" ")
  end

  def destroy_dependents
    #TODO
  end

end
