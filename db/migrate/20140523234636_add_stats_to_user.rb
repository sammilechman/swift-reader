class AddStatsToUser < ActiveRecord::Migration
  def change
    add_column :users, :total_words, :integer
    add_column :users, :total_time, :integer
    add_column :users, :average_speed, :integer
  end
end
