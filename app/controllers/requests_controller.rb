class RequestsController < ApplicationController
  def index
    render json: current_user.requests
  end

  def create
    # create based on user_id (automatic), place_id... for now
    # if station DNE, create one 
    requested_station = Station.find_or_create_by(place_id: request_params[placeId])
    requested_station.expiry_date = Time.zone.now.advance(days: 15) # duration
    if requested_station.save
      request = current_user.requests.build(request_params)
      request.save
      response = {saved: true}
    else
      response = {saved: false}
    end
    render json: response
  end

  def update
    # update expiry date
    requested_station = Station.find_by(place_id: request_params[:place_id])
    requested_station.expiry_date = Time.zone.now.advance(days: 15) 
    if requested_station.save
      request = current_user.requests.find_by(place_id: request_params[:place_id])
      request.touch
      response = {saved: true}
    else
      response = {saved: false}
    end
    render json: response
    # flawed, keep like this for now
  end

  def destroy
  end

  private

    def request_params
      params.require(:request).permit(:place_id, :duration, :nickname)
    end
end

