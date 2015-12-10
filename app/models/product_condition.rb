class ProductCondition < ActiveRecord::Base
  class << self; attr_accessor :conditions end
  @conditions = ProductCondition.all
end
