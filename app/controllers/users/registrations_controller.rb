class Users::RegistrationsController < Devise::RegistrationsController

  def edit
    redirect_to root_path and return if current_user.uid.present? && current_user.provider.present?
    super
  end

  protected
  def after_inactive_sign_up_path_for(resource)
    new_user_session_path
  end
end