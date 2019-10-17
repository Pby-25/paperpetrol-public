class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  include SessionsHelper

  protected
    def prevent_browser_caching
      response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate' # HTTP 1.1.
      response.headers['Pragma'] = 'no-cache' # HTTP 1.0.
      response.headers['Expires'] = '0' # Proxies.
    end

  private

    # Confirms a logged-in user.
    def logged_in_user
      unless logged_in?
        store_location
        flash[:danger] = "Please log in."
        redirect_to login_url
      end
    end
end