class UsersController < ApplicationController

  def create
    @user = User.new(user_params)
    if @user.save
      sign_in!(@user)
      redirect_to root_url
    else
      flash[:errors] = @user.errors.full_messages
      redirect_to root_url
    end
  end

  def update
    @user = User.find(params[:id])
    @user.update_attributes(user_params)
    @user.favorite_speed = user_params["favorite_speed"].to_i
    if @user.save
      redirect_to root_url
    else
      flash[:errors] = @user.errors.full_messages
      redirect_to root_url
    end
  end

  private

  def user_params
    params.require(:user).permit(:email, :password, :session_token, :total_words, :total_time, :average_speed, :favorite_speed)
  end

end
