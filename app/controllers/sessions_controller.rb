class SessionsController < ApplicationController

  def create
    @user = User.find_by_email(params[:user][:email])

    if @user.try(:is_password?, params[:user][:password])
      sign_in!(@user)
      redirect_to root_url
    else
      @user = User.new
      flash[:errors] = ["Invalid username or password"]
      redirect_to root_url
    end
  end

  def destroy
    sign_out!
    redirect_to root_url
  end

end