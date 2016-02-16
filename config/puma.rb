rails_env = ENV['RAILS_ENV'] || 'development'

threads 4,4

bind  "unix:///data/apps/dealmn/shared/tmp/puma/dealmn-puma.sock"
pidfile "/data/apps/dealmn/current/tmp/puma/pid"
state_path "/data/apps/dealmn/current/tmp/puma/state"

activate_control_app
