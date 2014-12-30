class AddWeixinSinaweiboTencentweiboToUser < ActiveRecord::Migration
  def change
    add_column :users, :weixin, :string
    add_column :users, :sina_weibo, :string
    add_column :users, :tencent_weibo, :string
  end
end
