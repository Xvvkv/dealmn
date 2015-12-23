Dealmn::Application.routes.draw do
  devise_for :users

  root :to => 'home#index'

  namespace :rest do
    resources :categories
    resources :listings do
      resources :bids
    end
    resources :images
    resources :contacts
    resources :users
    resources :bids
  end

  resources :listings do
    resources :bids
  end
  
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
