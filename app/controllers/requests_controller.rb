class RequestsController < ApplicationController
  def index
    # return place_id, 
    puts(current_user.requests)
    render json: current_user.requests
  end

  def create
    puts(params[:placeId])
    render json: {params[:placeId] => "das"}
  end

  def update
  end

  def destroy
  end

end

