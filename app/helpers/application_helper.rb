module ApplicationHelper
  def current_translations
    @translations ||= I18n.backend.send(:translations)
    @translations[I18n.locale].with_indifferent_access["js_view"]
  end
end
