require 'json'

class DataLoader
  def self.load_categories_from_file file_path
    file = File.read(file_path)
    data = JSON.parse(file)
    load_categories data
  end

  def self.load_categories json_data, parent_id=nil, column_num=nil
    if json_data.is_a? Hash
      json_data.each_with_index do |(k,v),i|
        c = Category.create(name: k, is_active: true, column_order: i, parent_id: parent_id, column_num: column_num)
        load_categories v, c.id
      end
    elsif json_data.is_a? Array
      json_data.each_with_index do |k,i|
        if (k.is_a? Hash) || (k.is_a? Array)
          load_categories k, parent_id, i
        elsif k.is_a? String
          c = Category.create(name: k, is_active: true, column_order: i, parent_id: parent_id, column_num: column_num)
        else
          puts k
          raise "unknown data[2] : #{json_data.to_json}"
        end
      end
    else
      raise "unknown data[1] : #{json_data.to_json}"
    end
  end
end