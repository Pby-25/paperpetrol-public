Rails.application.routes.draw do
  get 'users/new'
  get '/home', to: 'pages#home'
  get '/about', to: 'pages#about'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  root 'pages#home'
end
