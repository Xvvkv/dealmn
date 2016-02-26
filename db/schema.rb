# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20160226053622) do

  create_table "banner_items", :force => true do |t|
    t.integer  "banner_id"
    t.string   "file_file_name"
    t.string   "file_content_type"
    t.integer  "file_file_size"
    t.datetime "file_updated_at"
    t.datetime "start_date"
    t.datetime "end_date"
    t.boolean  "is_active"
    t.datetime "created_at",        :null => false
    t.datetime "updated_at",        :null => false
  end

  create_table "banners", :force => true do |t|
    t.string   "name"
    t.integer  "width"
    t.integer  "height"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "bid_images", :id => false, :force => true do |t|
    t.integer  "bid_id",     :null => false
    t.integer  "image_id",   :null => false
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "bid_images", ["bid_id", "image_id"], :name => "index_bid_images_on_bid_id_and_image_id", :unique => true

  create_table "bids", :force => true do |t|
    t.integer  "biddable_id",                  :null => false
    t.string   "biddable_type",                :null => false
    t.datetime "created_at",                   :null => false
    t.datetime "updated_at",                   :null => false
    t.string   "title",                        :null => false
    t.text     "description"
    t.integer  "user_id"
    t.integer  "status",        :default => 0, :null => false
    t.integer  "contact_id"
    t.datetime "accepted_date"
  end

  create_table "categories", :force => true do |t|
    t.string   "name",         :default => "",   :null => false
    t.boolean  "is_active",    :default => true, :null => false
    t.integer  "column_num"
    t.integer  "column_order"
    t.integer  "parent_id"
    t.datetime "created_at",                     :null => false
    t.datetime "updated_at",                     :null => false
  end

  create_table "contacts", :force => true do |t|
    t.integer  "user_id",                       :null => false
    t.string   "email"
    t.string   "phone"
    t.datetime "created_at",                    :null => false
    t.datetime "updated_at",                    :null => false
    t.boolean  "is_primary", :default => false, :null => false
  end

  add_index "contacts", ["user_id", "email", "phone"], :name => "index_contacts_on_user_id_and_email_and_phone", :unique => true

  create_table "images", :force => true do |t|
    t.string   "image_file_name"
    t.string   "image_content_type"
    t.integer  "image_file_size"
    t.datetime "image_updated_at"
    t.datetime "created_at",         :null => false
    t.datetime "updated_at",         :null => false
  end

  create_table "listing_images", :id => false, :force => true do |t|
    t.integer  "listing_id", :null => false
    t.integer  "image_id",   :null => false
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "listing_images", ["listing_id", "image_id"], :name => "index_listing_images_on_listing_id_and_image_id", :unique => true

  create_table "listing_ratings", :force => true do |t|
    t.integer  "listing_id", :null => false
    t.integer  "rater_id",   :null => false
    t.integer  "rating",     :null => false
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "listing_ratings", ["listing_id", "rater_id"], :name => "index_listing_ratings_on_listing_id_and_rater_id", :unique => true

  create_table "listing_tags", :force => true do |t|
    t.integer  "listing_id"
    t.integer  "tag_id"
    t.integer  "type"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "listings", :force => true do |t|
    t.integer  "user_id",                               :null => false
    t.string   "title",              :default => "",    :null => false
    t.text     "text_description"
    t.string   "wanted_description"
    t.integer  "item_id"
    t.string   "item_type"
    t.datetime "created_at",                            :null => false
    t.datetime "updated_at",                            :null => false
    t.integer  "status",                                :null => false
    t.integer  "category_id"
    t.integer  "contact_id"
    t.boolean  "is_free",            :default => false, :null => false
    t.integer  "price_range_min"
    t.integer  "price_range_max"
    t.datetime "published_date"
    t.integer  "publishment_id"
    t.integer  "hit_counter",        :default => 0,     :null => false
    t.boolean  "is_for_donation",    :default => false, :null => false
    t.datetime "donated_at"
  end

  add_index "listings", ["published_date"], :name => "index_listings_on_published_date"
  add_index "listings", ["publishment_id"], :name => "index_listings_on_publishment_id", :unique => true

  create_table "message_texts", :force => true do |t|
    t.integer  "message_id",   :null => false
    t.integer  "direction",    :null => false
    t.text     "message_text", :null => false
    t.datetime "created_at",   :null => false
    t.datetime "updated_at",   :null => false
  end

  create_table "messages", :force => true do |t|
    t.integer  "initiator_id",            :null => false
    t.integer  "participant_id",          :null => false
    t.integer  "initiator_status",        :null => false
    t.integer  "participant_status",      :null => false
    t.datetime "last_message_at",         :null => false
    t.integer  "initiator_deletion_id"
    t.integer  "participant_deletion_id"
    t.datetime "created_at",              :null => false
    t.datetime "updated_at",              :null => false
  end

  create_table "notifications", :force => true do |t|
    t.integer  "user_id",                   :null => false
    t.text     "message",                   :null => false
    t.string   "url"
    t.datetime "created_at",                :null => false
    t.datetime "updated_at",                :null => false
    t.integer  "sender_id"
    t.integer  "status",     :default => 0, :null => false
  end

  create_table "product_conditions", :force => true do |t|
    t.string   "title"
    t.string   "description"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  create_table "products", :force => true do |t|
    t.datetime "created_at",            :null => false
    t.datetime "updated_at",            :null => false
    t.integer  "product_condition_id"
    t.string   "condition_description"
  end

  create_table "services", :force => true do |t|
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "site_stats", :force => true do |t|
    t.integer  "total_listing",      :default => 0, :null => false
    t.integer  "total_accepted_bid", :default => 0, :null => false
    t.datetime "created_at",                        :null => false
    t.datetime "updated_at",                        :null => false
  end

  create_table "spec_suggestions", :force => true do |t|
    t.integer  "category_id", :null => false
    t.string   "name",        :null => false
    t.string   "placeholder"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  create_table "specs", :force => true do |t|
    t.integer  "listing_id", :null => false
    t.string   "name",       :null => false
    t.string   "value",      :null => false
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "specs", ["listing_id", "name"], :name => "index_specs_on_listing_id_and_name", :unique => true

  create_table "tags", :force => true do |t|
    t.string   "name"
    t.integer  "search_count"
    t.datetime "created_at",   :null => false
    t.datetime "updated_at",   :null => false
  end

  create_table "user_permissions", :force => true do |t|
    t.integer  "user_id",    :null => false
    t.integer  "permission", :null => false
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "user_ratings", :force => true do |t|
    t.integer  "user_id",    :null => false
    t.integer  "rater_id",   :null => false
    t.integer  "rating",     :null => false
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "user_ratings", ["user_id", "rater_id"], :name => "index_user_ratings_on_user_id_and_rater_id", :unique => true

  create_table "user_settings", :force => true do |t|
    t.integer  "user_id",    :null => false
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "user_stats", :force => true do |t|
    t.integer  "user_id",                             :null => false
    t.integer  "rating_sum",           :default => 0, :null => false
    t.integer  "rating_count",         :default => 0, :null => false
    t.integer  "total_listing",        :default => 0, :null => false
    t.integer  "total_accepted_bid",   :default => 0, :null => false
    t.datetime "created_at",                          :null => false
    t.datetime "updated_at",                          :null => false
    t.integer  "total_active_listing", :default => 0, :null => false
    t.integer  "total_bids_sent",      :default => 0, :null => false
    t.integer  "total_bids_received",  :default => 0, :null => false
  end

  create_table "users", :force => true do |t|
    t.string   "email",                  :default => "", :null => false
    t.string   "encrypted_password",     :default => "", :null => false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          :default => 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.string   "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string   "unconfirmed_email"
    t.datetime "created_at",                             :null => false
    t.datetime "updated_at",                             :null => false
    t.string   "first_name",             :default => "", :null => false
    t.string   "last_name",              :default => "", :null => false
    t.string   "uid"
    t.string   "provider"
    t.integer  "avatar_id"
    t.integer  "user_type",              :default => 0,  :null => false
  end

  add_index "users", ["email"], :name => "index_users_on_email", :unique => true
  add_index "users", ["reset_password_token"], :name => "index_users_on_reset_password_token", :unique => true

  create_table "wish_lists", :force => true do |t|
    t.integer  "listing_id", :null => false
    t.integer  "user_id",    :null => false
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

end
