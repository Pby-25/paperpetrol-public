class InteractiveMapsController < ApplicationController
  before_action :logged_in_user, :prevent_browser_caching
  def new
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate' # HTTP 1.1.
    response.headers['Pragma'] = 'no-cache' # HTTP 1.0.
    response.headers['Expires'] = '0' # Proxies.
  end

  def experiment
    respond_to do |format|
      format.html 
      format.json { render json: @user }
    end
  end
end
