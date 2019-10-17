class StaticPagesController < ApplicationController
  helper_method :main_page
  before_action :prevent_browser_caching

  def main_page
    redirect_to "/main"
  end

  def home
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate' # HTTP 1.1.
    response.headers['Pragma'] = 'no-cache' # HTTP 1.0.
    response.headers['Expires'] = '0' # Proxies.
  end

  def help
  end

  def about
  end

  def contact
  end
end
