class RequestsController < ApplicationController
  def index
    render json: current_user.requests
  end

  def create
    # create based on user_id (automatic), place_id... for now
    # if station DNE, create one 
    requested_station = Station.find_or_create_by(place_id: params[:placeId])
    requested_station.expiry_date = Time.zone.advance(days:15)
    # update link in station controller
    puts("this")

    puts (params[:thing])

    puts("that")
    response = params[:gogogo]
    render json: response
  end

  def update
    # update expiry date
  end

  def destroy
  end

end

