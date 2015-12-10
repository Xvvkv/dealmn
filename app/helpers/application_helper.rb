module ApplicationHelper
  def current_translations
    @translations ||= I18n.backend.send(:translations)
    @translations = @translations[I18n.locale].with_indifferent_access
    ret = @translations["js_view"]["general"]
    ret["page"] = @translations["js_view"][controller.controller_name].try(:[], controller.action_name)
    ret
  end
end
