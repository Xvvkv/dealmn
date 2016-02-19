class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,  
    :recoverable, :rememberable, :trackable, :validatable, :confirmable, :omniauthable
        
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

  before_create :randomize_id
  after_create :create_dependents
  after_create :send_welcome_notification

  belongs_to :avatar, :class_name => 'Image', :foreign_key => :avatar_id

  has_one :user_stat

  has_many :contacts

  has_many :bids
  has_many :listings
  has_many :received_bids, :through => :listings, :source => :bids
  has_many :wish_lists
  has_many :wished_listings, :through => :wish_lists, :source => :listing
  has_many :notifications

  has_many :ratings, :class_name => 'UserRating', :foreign_key => :user_id
  has_many :rates, :class_name => 'UserRating', :foreign_key => :rater_id

  has_one :primary_contact, :class_name => "Contact", :conditions => { :is_primary => true } 

  delegate :rating, :rating_count, to: :user_stat

  has_many :initiated_messages, :class_name => 'Message', :foreign_key => :initiator_id
  has_many :participated_messages, :class_name => 'Message', :foreign_key => :participant_id

  TYPE = {regular: 0, admin: 1, voucher_redeemer: 2}

  def display_name
    return "#{self.last_name[0...1].upcase}.#{self.first_name.camelcase}" if self.last_name.present? && self.first_name.present?
    return self.first_name if self.first_name.present?
    return self.email
  end

  def full_name
    return "#{self.last_name} #{self.first_name}" if self.last_name.present? && self.first_name.present?
    return "#{self.last_name}#{self.first_name}" if self.last_name.present? || self.first_name.present?
    return self.email
  end

  def prof_pic type=:thumb
    self.avatar.image.url(type) if self.avatar
  end

  def prof_pic_large
    prof_pic :large
  end

  def registered_date
    self.created_at.in_time_zone("Asia/Ulaanbaatar").strftime("%Y.%m.%d")
  end

  def rate rater, rating
    raise "Invalid Request" if self.id == rater.id

    ur = UserRating.create(user_id: self.id, rater_id: rater.id, rating: rating)
    
    self.user_stat.rating_sum += rating
    self.user_stat.rating_count += 1
    self.user_stat.save
    
    ur
  end

  def messages options={}
    if options[:mark_seen]
      Message.where(initiator_id: self.id, initiator_status: Message::STATUS[:unseen]).update_all(initiator_status: Message::STATUS[:seen])
      Message.where(participant_id: self.id, participant_status: Message::STATUS[:unseen]).update_all(participant_status: Message::STATUS[:seen])
    end

    messages = Message.where("(initiator_id = ? AND initiator_status <> ?) OR (participant_id = ? AND participant_status <> ?)", self.id, Message::STATUS[:deleted], self.id, Message::STATUS[:deleted]).order('last_message_at DESC')
    messages = messages.limit(options[:limit]) if options[:limit]

    messages
  end

  def unseen_messages
    Message.where("(initiator_id = ? AND initiator_status = ?) OR (participant_id = ? AND participant_status = ?)", self.id, Message::STATUS[:unseen], self.id, Message::STATUS[:unseen]).order('last_message_at DESC')
  end

  def unread_messages
    Message.where("(initiator_id = ? AND initiator_status in (?)) OR (participant_id = ? AND participant_status in (?))", self.id, [Message::STATUS[:unseen],Message::STATUS[:seen]], self.id, [Message::STATUS[:unseen],Message::STATUS[:seen]]).order('last_message_at DESC')
  end

  def notifications_with_opt options={}
    res = Notification.where(user_id: self.id).order('id desc')
    res = res.limit(options[:limit]) if options[:limit]
    res = res.clone
    if options[:mark_seen]
      Notification.where(user_id: self.id, status: Notification::STATUS[:unseen]).update_all(status: Notification::STATUS[:seen])
    end
    res
  end

  def sync_stat
    stat = self.user_stat
    stat ||= UserStat.create(user_id: self.id)

    stat.rating_count = self.ratings.size
    stat.rating_sum = self.ratings.sum(:rating)
    
    stat.total_listing = self.listings.non_draft.size
    stat.total_active_listing = self.listings.published.size
    stat.total_accepted_bid = self.bids.accepted.size + self.received_bids.accepted.size
    stat.total_bids_sent = self.bids.active.size
    stat.total_bids_received = self.received_bids.where('bids.status <> ?',Bid::STATUS[:deleted]).size
    stat.save
  end

  def send_notification message, url='#', sender=nil
    Notification.create(message: message, url: url, user_id: self.id, sender_id: (sender.try(:id) || 0), status: Notification::STATUS[:unseen])
  end

  def self.from_omniauth_facebook(auth)
    where(email: auth.info.email).first_or_create do |user|
      user.provider = auth.provider
      user.uid = auth.uid
      user.email = auth.info.email
      user.password = Devise.friendly_token[10,20]
      user.first_name = auth.info.first_name
      user.last_name = auth.info.last_name
      user.avatar_id = Image.create_image_from_url("#{auth.info.image}?type=large").id
      user.skip_confirmation!
    end
  end

  def self.from_omniauth_twitter(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.provider = auth.provider
      user.uid = auth.uid
      user.password = Devise.friendly_token[10,20]
      user.first_name = auth.info.name
      puts auth.info.image
      user.avatar_id = Image.create_image_from_url(auth.info.image.sub("_normal", "")).id
      user.email = "user.#{self.id}.#{SecureRandom.random_number(100_000_000)}@change_your_email.com"
      user.skip_confirmation!
    end
  end

  def self.from_omniauth_google(auth)
    where(email: auth.info.email).first_or_create do |user|
      user.provider = auth.provider
      user.uid = auth.uid
      user.email = auth.info.email
      user.password = Devise.friendly_token[10,20]
      user.first_name = auth.info.first_name
      user.last_name = auth.info.last_name
      user.avatar_id = Image.create_image_from_url(auth.info.image.sub("sz=50", "")).id
      user.skip_confirmation!
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

  def create_dependents
    UserStat.create(user_id: self.id)
    UserSetting.create(user_id: self.id)
    Contact.create(user_id: self.id, is_primary: true, email: self.email) unless self.provider == 'twitter'
  end

  def send_welcome_notification
    self.send_notification I18n.t('notifications.welcome')
  end

  def randomize_id
    begin
      self.id = SecureRandom.random_number(100_000_000)
    end while User.where(id: self.id).exists?
  end

end
