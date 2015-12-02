require 'json'

class DataLoader
  def self.load_categories_from_file file_path
    file = File.read(file_path)
    data = JSON.parse(file)
    load_categories data
  end

  def self.load_categories json_data, parent_id=nil
    if json_data.is_a? Hash
      json_data.each_with_index do |(k,v),i|
        c = Category.create(name: k, is_active: true, position_order: i, parent_id: parent_id)
        load_categories v, c.id
      end
    elsif json_data.is_a? Array
      json_data.each_with_index do |k,i|
        c = Category.create(name: k, is_active: true, position_order: i, parent_id: parent_id)
      end
    else
      raise "unknown data : #{json_data.to_json}"
    end
  end
end