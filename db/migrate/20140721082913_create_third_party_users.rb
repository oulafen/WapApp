class CreateThirdPartyUsers < ActiveRecord::Migration
  def change
    create_table :third_party_users do |t|
      t.string :name
      t.string :from
      t.string :head

      t.timestamps
    end
  end
end
