class ModifyColumnInApps < ActiveRecord::Migration
  def change
    remove_column :apps,:ipa_file_name,:string
    remove_column :apps,:ipa_content_type,:string
    remove_column :apps,:ipa_file_size,:integer
    remove_column :apps,:ipa_updated_at,:string
    add_column :apps, :ipa_key, :string
    add_column :apps, :ipa_name, :string
    add_column :apps, :ipa_size, :integer
    add_column :apps, :ipa_type, :string
  end
end
