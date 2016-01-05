Dealmn::Application.routes.draw do
  devise_for :users, :path => '',
        :path_names => {:sign_in => 'login', :sign_up => 'signup', :sign_out => 'logout'},
        :controllers => { :omniauth_callbacks => "users/omniauth_callbacks"}

  root :to => 'home#index'

  namespace :rest do
    resources :categories
    resources :listings do
      resources :bids, only: [:index, :create]
      resources :listing_ratings
    end
    resources :bids, only: [:index, :show]
    resources :images
    resources :contacts
    resources :wish_lists
    resources :user_ratings
  end

  resources :listings do
    resources :bids, only: [:new]
  end
  resources :bids, only: [:show]
  
  match 'test1' => 'home#page1', via: :get
  match 'test2' => 'home#page2', via: :get
  match 'test3' => 'home#page3', via: :get
  match 'test4' => 'home#page4', via: :get
  match 'test5' => 'home#page5', via: :get
  match 'test6' => 'home#page6', via: :get
  match 'test7' => 'home#page7', via: :get
  match 'test8' => 'home#page8', via: :get
  match 'test9' => 'home#page9', via: :get
  match 'test10' => 'home#page10', via: :get
  match 'test11' => 'home#page11', via: :get
  match 'test12' => 'home#page12', via: :get
end
