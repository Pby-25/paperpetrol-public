# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2019_10_12_191914) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "entries", force: :cascade do |t|
    t.string "price"
    t.string "grade"
    t.bigint "record_id"
    t.index ["record_id"], name: "index_entries_on_record_id"
  end

  create_table "records", force: :cascade do |t|
    t.bigint "station_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["station_id"], name: "index_records_on_station_id"
  end

  create_table "requests", force: :cascade do |t|
    t.integer "user_id"
    t.string "place_id"
    t.integer "duration"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "nickname"
    t.index ["place_id"], name: "index_requests_on_place_id"
    t.index ["user_id", "place_id"], name: "index_requests_on_user_id_and_place_id", unique: true
    t.index ["user_id"], name: "index_requests_on_user_id"
  end

  create_table "stations", force: :cascade do |t|
    t.string "place_id"
    t.datetime "expiry_date"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "link"
    t.index ["place_id"], name: "index_stations_on_place_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.string "password_digest"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "remember_digest"
    t.string "activation_digest"
    t.boolean "activated", default: false
    t.datetime "activated_at"
    t.string "reset_digest"
    t.datetime "reset_sent_at"
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "entries", "records"
  add_foreign_key "records", "stations"
end
