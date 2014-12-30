# Load the Rails application.
require File.expand_path('../application', __FILE__)

# Initialize the Rails application.
FingerBangWebApp::Application.initialize!
ActionMailer::Base.smtp_settings =
    {
        :address => "smtp.126.com",
        :domain => "mail.126.com",
        :user_name => "shockingli@126.com",
        :password => "lixiaokang",
        :authentication => :login,
    }
