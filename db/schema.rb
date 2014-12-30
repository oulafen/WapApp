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
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140803050609) do

  create_table "activities", force: true do |t|
    t.string   "name"
    t.integer  "app_id"
    t.string   "activity_type"
    t.string   "deduct_integral"
    t.string   "activity_time"
    t.string   "detail"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "admins", force: true do |t|
    t.string   "name"
    t.string   "login_type"
    t.string   "password_digest"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "ads", force: true do |t|
    t.string   "image"
    t.text     "describe"
    t.string   "ad_link"
    t.string   "image_local_path"
    t.integer  "index"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "position",         default: "home"
  end

  create_table "app_categories", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "app_category_details", force: true do |t|
    t.integer  "app_category_id"
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "app_photos", force: true do |t|
    t.integer  "app_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "photo_file_name"
    t.string   "photo_content_type"
    t.integer  "photo_file_size"
    t.datetime "photo_updated_at"
  end

  create_table "apps", force: true do |t|
    t.string   "name"
    t.integer  "cdkey"
    t.integer  "activity"
    t.integer  "category_index_id"
    t.integer  "category_detail_id"
    t.string   "apk_link"
    t.string   "iphone_link"
    t.string   "video_link"
    t.integer  "price"
    t.string   "introduce"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "logo_file_name"
    t.string   "logo_content_type"
    t.integer  "logo_file_size"
    t.datetime "logo_updated_at"
    t.string   "apk_key"
    t.string   "apk_name"
    t.integer  "apk_size"
    t.string   "apk_type"
    t.string   "ipa_key"
    t.string   "ipa_name"
    t.integer  "ipa_size"
    t.string   "ipa_type"
  end

  create_table "download_apps", force: true do |t|
    t.string   "user_mailbox"
    t.integer  "app_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "emailchecks", force: true do |t|
    t.string   "email"
    t.string   "code"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "excels", force: true do |t|
    t.string   "excel_file_name"
    t.string   "excel_content_type"
    t.integer  "excel_file_size"
    t.datetime "excel_updated_at"
  end

  create_table "feedbacks", force: true do |t|
    t.integer  "user"
    t.text     "body",       limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "gift_packs", force: true do |t|
    t.integer  "app_id"
    t.integer  "amount"
    t.string   "gift_pack_type"
    t.string   "deduct_integral"
    t.string   "applicable_time"
    t.string   "detail"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "name"
    t.string   "card_nums"
  end

  create_table "messages", force: true do |t|
    t.integer  "sender"
    t.integer  "to_user"
    t.string   "content"
    t.string   "title"
    t.string   "msg_type"
    t.integer  "item_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "recommends", force: true do |t|
    t.string   "show_type"
    t.integer  "item_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "replies", force: true do |t|
    t.integer  "replier"
    t.integer  "item"
    t.text     "reply_body"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "item_type"
    t.boolean  "is_third_part_user"
  end

  create_table "strategies", force: true do |t|
    t.string   "name"
    t.integer  "view_num"
    t.string   "video_link"
    t.text     "detail_content"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "list_img_file_name"
    t.string   "list_img_content_type"
    t.integer  "list_img_file_size"
    t.datetime "list_img_updated_at"
    t.string   "video_img_file_name"
    t.string   "video_img_content_type"
    t.integer  "video_img_file_size"
    t.datetime "video_img_updated_at"
    t.integer  "app_id"
  end

  create_table "third_party_users", force: true do |t|
    t.string   "name"
    t.string   "from"
    t.string   "head"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "third_party_id"
  end

  create_table "topics", force: true do |t|
    t.string   "title"
    t.text     "body"
    t.integer  "owner"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "view_num"
    t.boolean  "is_third_part_user"
  end

  create_table "user_activities", force: true do |t|
    t.integer  "user_id"
    t.integer  "activity_id"
    t.integer  "app_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "user_gift_packs", force: true do |t|
    t.integer  "user_id"
    t.integer  "gift_pack_id"
    t.integer  "app_id"
    t.string   "gift_pack_card_num"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", force: true do |t|
    t.string   "mailbox"
    t.string   "nickname"
    t.string   "password_digest"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "logo_file_name"
    t.string   "logo_content_type"
    t.integer  "logo_file_size"
    t.datetime "logo_updated_at"
    t.integer  "integral",          default: 2000
    t.string   "weixin"
    t.string   "sina_weibo"
    t.string   "tencent_weibo"
    t.boolean  "isadmin"
    t.string   "third_logo"
  end

  create_table "video_imgs", force: true do |t|
    t.string   "img"
    t.integer  "video_id"
    t.string   "video_img_local_path"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "videos", force: true do |t|
    t.string   "name"
    t.integer  "views",               default: 0
    t.string   "position"
    t.string   "video_link"
    t.string   "list_img"
    t.string   "cover"
    t.text     "intro"
    t.string   "video_img"
    t.string   "list_img_local_path"
    t.string   "cover_local_path"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "is_recommend"
  end

end
