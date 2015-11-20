namespace :generate_dummy_data do
desc "Generates dummy data for test purpose"
  task run_all: :environment do
    DataGenerator.run_all
  end
end