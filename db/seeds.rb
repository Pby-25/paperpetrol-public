User.create!(name:  "admin",
             email: "example@paperpetrol.com",
             password:              "foobar",
             password_confirmation: "foobar",
             activated: true,
             activated_at: Time.zone.now)

# user = User.first
# req = user.requests.build({place_id: "Arial", duration: 555, nickname: "yo"})
# req.save