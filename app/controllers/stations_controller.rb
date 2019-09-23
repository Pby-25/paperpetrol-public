class StationsController < ApplicationController

  def show
    # show all records and associated entries based on place_id, that's good enough for now.
    station = Station.find_by(place_id: station_params[:place_id])
    response = {}
    station.records.each do |record|
      pretty_record = {}
      record.entries.each do |entry|
        pretty_record[entry[:grade]] = entry[:price]
      end
      response[record[:created_at]] = pretty_record
    end
    render json: response
  end

  # one function to retrieve records to be updated
  def fetch
    fetch_limit = 5
    stations_to_be_refreshed = Station.order(updated_at: :asc)
                                      .where("expiry_date > ? ", Time.zone.now)
                                      .limit(fetch_limit)
    render json: stations_to_be_refreshed
  end

  # one function to update a station, if new record are retrieved
  def add_record
    station = Station.find_by(place_id: station_params[:place_id])
    record = station.records.build
    station_params[:records].each do |key, value|
      record.create({grade: key, price: value})
    end
    record.save
    station.save
  end

  private
  
    def station_params
      params.require(:station).permit(:place_id, :records)
    end
end
