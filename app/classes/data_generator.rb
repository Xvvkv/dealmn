# encoding: utf-8
class DataGenerator
  def self.run_all
    generate_users
    generate_categories
    generate_product_conditions
    generate_spec_suggestions
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

  def self.generate_spec_suggestions
    cat1 = Category.last(2).first
    cat2 = Category.last
    
    ss = SpecSuggestion.new
    ss.category_id = cat1.id
    ss.name = 'Бүтээгдэхүүний нэр'
    ss.placeholder = 'iPhone 5'
    ss.save!

    ss = SpecSuggestion.new
    ss.category_id = cat1.id
    ss.name = 'Үйлдлийн систем'
    ss.placeholder = 'IOS v5.0'
    ss.save!

    ss = SpecSuggestion.new
    ss.category_id = cat1.id
    ss.name = 'Дэлгэцийн хэмжээ'
    ss.placeholder = '5.1 inch'
    ss.save!

    ss = SpecSuggestion.new
    ss.category_id = cat2.id
    ss.name = 'Хөдөлгүүрийн багтаамж'
    ss.placeholder = '2.5'
    ss.save!

    ss = SpecSuggestion.new
    ss.category_id = cat2.id
    ss.name = 'Шатахуун зарцуулалт'
    ss.placeholder = '12l/100km'
    ss.save!

    ss = SpecSuggestion.new
    ss.category_id = cat2.id
    ss.name = 'Өнгө'
    ss.placeholder = 'Мөнгөлөг цагаан'
    ss.save!

  end

end