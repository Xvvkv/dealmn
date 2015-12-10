# encoding: utf-8
class DataGenerator
  def self.run_all
    generate_users
    generate_categories
    generate_product_conditions
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
    DataLoader.load_categories_from_file Rails.root.join("data","loader_files","categories.json")
  end

  def self.generate_product_conditions
    pc = ProductCondition.new
    pc.title = 'Шинэ'
    pc.description = 'description placeholder'
    pc.save!

    pc = ProductCondition.new
    pc.title = 'Шинэвтэр'
    pc.description = 'description placeholder2'
    pc.save!

    pc = ProductCondition.new
    pc.title = 'Цэвэрхэн хэрэглэсэн'
    pc.description = 'description placeholder3'
    pc.save!

    pc = ProductCondition.new
    pc.title = 'Хуучин'
    pc.description = 'description placeholder4'
    pc.save!
  end

end