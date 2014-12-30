class RenameAreDeductIntegralToDeductIntegral < ActiveRecord::Migration
  def change
    rename_column :gift_packs, :are_deduct_integral, :deduct_integral
  end
end
