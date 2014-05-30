class AddFavoriteSpeed < ActiveRecord::Migration
  def change
    add_column :users, :favorite_speed, :integer, default: 220
  end
end
