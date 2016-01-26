class UserStatSynchronizer
  def self.sync
    User.all.each do |u|
      u.sync_stat
    end
  end
end