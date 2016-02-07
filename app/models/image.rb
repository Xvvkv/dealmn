class Image < ActiveRecord::Base
  attr_accessor :crop_x, :crop_y, :crop_w, :crop_h

  attr_accessible :image, :status
  has_attached_file :image, :styles => { :large => "600x600>", :thumb => "125x125>" }, :processors => [:cropper], :convert_options => {all: "-strip -quality 85%"}
  validates_attachment_content_type :image, :content_type => /\Aimage\/.*\Z/

  STATUS = {not_processed: 0, processed: 1}


  after_create :destroy_original

  def destroy_original
    if self.image.present? && Pathname.new(self.image.path).exist?
        self.image.save
        File.unlink(self.image.path)
    end
    #not working
    #File.delete(self.image.path)
  end

  def self.create_image_from_url (image_url)
    image = Image.create(image: URI.parse(process_uri(image_url)))
    image
  end

  private
  def self.process_uri(uri)
   avatar_url = URI.parse(uri)
   avatar_url.scheme = 'https'
   avatar_url.to_s
  end
end
