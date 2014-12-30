class CreateEmailchecks < ActiveRecord::Migration
  def change
    create_table :emailchecks do |t|
      t.string :email
      t.string :code

      t.timestamps
    end
  end
end
