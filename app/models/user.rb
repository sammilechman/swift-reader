class User < ActiveRecord::Base

  attr_accessor :password

  validates :email, :password, presence: true
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
