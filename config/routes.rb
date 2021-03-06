Dealmn::Application.routes.draw do
  devise_for :users, :path => '',
        :path_names => {:sign_in => 'login', :sign_up => 'signup', :sign_out => 'logout'},
        :controllers => { :omniauth_callbacks => "users/omniauth_callbacks", :registrations => "users/registrations"}

  root :to => 'home#index'

  namespace :rest do
    resources :categories
    resources :listings do
      resources :bids, only: [:index, :create]
      resources :listing_ratings
      collection do
        get :free_items
        get :fetch_ids
      end
    end
    resources :bids, only: [:index, :show, :update, :destroy] do
      collection do
        get :latest_deals
      end
      member do
        put :accept
      end
    end
    resources :images
    resources :contacts
    resources :site_stats, only: [] do
      collection do
        get :get_stat
      end
    end
    resources :wish_lists, only: [:index, :create, :destroy]
    resources :user_ratings
    resources :users, only: [:show, :update] do
      resources :listings, only: [:index]
      resources :bids, only: [:index]
      resources :messages, only: [:index, :show, :create] do
        collection do
          post :mark
          delete :delete_selected
        end
      end
      resources :notifications, onlly: [:index]
      member do
        put :tos_agree
      end
    end
  end

  resources :listings do
    resources :bids, only: [:new]
  end
  resources :bids, only: [:show, :edit]

  resources :users, only: [:show]

  resources :wish_lists, only: [:index]

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
  match 'test13' => 'home#page13', via: :get
  match 'test14' => 'home#page14', via: :get
  match 'test15' => 'home#page15', via: :get
  match 'test16' => 'home#page16', via: :get
  match 'test17' => 'home#page17', via: :get
  match 'test18' => 'home#page18', via: :get
  match 'test19' => 'home#page19', via: :get
  match 'test20' => 'home#page20', via: :get

  match "/404", :to => "errors#render404"
  match "/422", :to => "errors#render422"
  match "/500", :to => "errors#render500"

  match 'about' => 'home#about', via: :get
  match 'terms' => 'home#terms', via: :get

end
