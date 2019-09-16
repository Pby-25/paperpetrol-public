class Request < ApplicationRecord
  belongs_to :user
  has_one :station
end
