class AddAttachmentExcelToExcels < ActiveRecord::Migration
  def self.up
    change_table :excels do |t|
      t.attachment :excel
    end
  end

  def self.down
    drop_attached_file :excels, :excel
  end
end
