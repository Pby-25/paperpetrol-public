class InteractiveMapsController < ApplicationController
  before_action :logged_in_user
  def new
  end

  def experiment
    respond_to do |format|
      format.html 
      format.json { render json: @user }
    end
  end
end
