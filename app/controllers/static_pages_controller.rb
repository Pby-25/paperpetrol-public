class StaticPagesController < ApplicationController
  helper_method :main_page
  def main_page
    redirect_to "/main"
  end

  def home
  end

  def help
  end

  def about
  end

  def contact
  end
end
