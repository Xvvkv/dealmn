module ApplicationHelper
  def current_translations
    @translations ||= I18n.backend.send(:translations)
    @translations = @translations[I18n.locale].with_indifferent_access
    ret = @translations["js_view"]["general"]
    ret["page"] = @translations["js_view"][controller.controller_name].try(:[], controller.action_name)
    ret
  end

  def is_non_negative_integer val
    val.to_i >= 0 && val.to_i.to_s == val.to_s
  end
end
