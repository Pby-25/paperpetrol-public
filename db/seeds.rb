User.create!(name:  "admin",
             email: "example@paperpetrol.com",
             password:              "foobar",
             password_confirmation: "foobar",
             activated: true,
             activated_at: Time.zone.now)