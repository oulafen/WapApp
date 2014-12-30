class AddThirdPartyIdToThirdPartyUsers < ActiveRecord::Migration
  def change
    add_column :third_party_users ,:third_party_id,:string
  end
end
