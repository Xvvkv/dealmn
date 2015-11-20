# encoding: utf-8
class DataGenerator
  def self.run_all
    generate_users
    generate_categories
  end

  def self.generate_users
    u = User.new
    u.email = 'boldoo.gn@gmail.com'
    u.password = '12345678'
    u.first_name = 'Энхболд'
    u.last_name = 'Цагаач'
    u.save!
  end

  def self.generate_categories
    puts 'world'
  end
end