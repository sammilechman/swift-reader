class User < ActiveRecord::Base

  attr_accessor :password, :favorite_speed

  validates :email, presence: true

  #Problem: can't save when logging out because no password.
  #Is this method of allowing nil insecure?
  validates :password, presence: true, allow_nil: true
  validates :password, length: { minimum: 6, allow_nil: true }

  def reset_session_token!
    self.session_token = SecureRandom.urlsafe_base64(16)
    self.save!
    self.session_token
  end

  def password=(plaintext)
    @password = plaintext
    self.password_digest = BCrypt::Password.create(plaintext) if @password
  end

  def is_password?(plaintext)
    BCrypt::Password.new(self.password_digest).is_password?(plaintext)
  end

end
