class Api::UsersController < ApplicationController
  def index
    @users = User.all
    render :json => @users
  end

  def create
    @user = User.new(user_params)
    if @user.save
      render :json => @user
    else
      render :json => @user.errors.full_messages, :status => 422
    end
  end

  def update
    @user = User.find(params[:id])
    @user.favorite_speed = params["favorite_speed"].to_i
    if @user.save
      p @user
      redirect_to root_url
    else
      render :json => @user.errors.full_messages, :status => 422
    end
  end

  def destroy
    @user = User.find(params[:id])
    @user.destroy if @user
    render :json => {}
  end

    private
    def user_params
      params.require(:user).permit(:email, :password_digest, :session_token, :total_words, :total_time, :average_speed, :favorite_speed)
    end
end
