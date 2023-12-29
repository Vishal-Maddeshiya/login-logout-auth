import UserModel from "../model/User.model.js";
import bcrypt, { hash } from "bcrypt";
import Jwt from "jsonwebtoken";
import ENV from "../config.js";
import otpGenerator from "otp-generator";

// middleware for verify user
export async function verifyUser(req, res, next) {
  try {
    const { username } = req.method == "GET" ? req.query : req.body;

    // check the user existing

    let exist = await UserModel.findOne({ username });
    if (!exist) return res.status(404).send({ error: "Can't find user" });
    next();
  } catch (error) {
    return res.status(404).send({ error: "Authentication Error" });
  }
}

// post controller for regitration
export async function register(req, res) {
  try {
    const { username, profile, password, email } = req.body;

    //check existing email
    const existEmail = await UserModel.findOne({ email });

    //check user existing
    const existUsername = await UserModel.findOne({ username });

    Promise.all([existEmail, existUsername])
      .then(() => {
        if (password) {
          bcrypt
            .hash(password, 10)
            .then((hashedPassword) => {
              const user = new UserModel({
                username,
                password: hashedPassword,
                profile: profile || "",
                email,
              });
              // / return save user result
              user
                .save()
                .then((result) => {
                  res.status(201).send({
                    msg: "User register successfull",
                  });
                })
                .catch((error) =>
                  res.status(500).send({ error: "Registration failed" })
                );
            })
            .catch((error) => {
              return res.status(500).send({
                error: "Enabled hashed password",
              });
            });
        }
      })
      .catch((error) => {
        return res.status(500).send({ error: "err" });
      });
  } catch (error) {
    return res.status(500).send({ error: "end error" });
  }
}

// post controller for login
export async function login(req, res) {
  const { username, password } = req.body;

  try {
    UserModel.findOne({ username })
      .then((user) => {
        bcrypt
          .compare(password, user.password)
          .then((passwordCheck) => {
            if (!passwordCheck) {
              return res.status(400).send({ error: "Don't have password" });
            }

            //create jwt token
            const token = Jwt.sign(
              {
                userId: user._id,
                username: user.username,
              },
              ENV.JWT_SECRET,
              { expiresIn: "24h" }
            );

            return res.status(200).send({
              msg: "Login successfull",
              username: user.username,
              token,
            });
          })
          .catch((error) => {
            return res.status(400).send({ error: "Passwor does not match" });
          });
      })
      .catch((err) => {});
  } catch (error) {
    return res.status(500).send({ error: "Username not found" });
  }
}

// get controller for get user
export async function getUser(req, res) {
  const { username } = req.params;

  try {
    if (!username) return res.status(501).send({ error: "Invalid Username" });
    UserModel.findOne({ username })
      .then((user) => {
        const { password, ...rest } = Object.assign({}, user.toJSON());
        return res.status(201).send(rest);
      })
      .catch((err) => {
        return res.status(500).send(err);
      });
  } catch (error) {
    return res.status(404).send({ error: "Can't find user data" });
  }
}

export async function updateUser(req, res) {
  try {
    // const { id } = req.query.id;
    const { userId } = req.user;
    if (userId) {
      const body = req.body;

      // updata the data//
      UserModel.updateOne({ _id: userId }, body)
        .then((result) => {
          return res.status(201).send({ msg: "Record Updated!" });
        })
        .catch((err) => {
          return res.status(401).send({ error: "user not found" });
        });
    } else {
      return res.status(401).send({ error: "User not found" });
    }
  } catch (error) {
    return res.status(401).send({ error });
  }
}

export async function genrateOtp(req, res) {
  req.app.locals.OTP = await otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  res.status(201).send({ code: req.app.locals.OTP });
}

export async function verifyOtp(req, res) {
  const { code } = req.query;
  if (parseInt(req.app.locals.OTP) === parseInt(code)) {
    req.app.locals.OTP = null; //reset otp value
    req.app.locals.resetSession = true; // start session for reset password
    return res.status(201).send({ msg: "Verify successfull" });
  }
  return res.status(400).send({ error: "Invalid OTP" });
}

export async function createResetSession(req, res) {
  if (req.app.locals.resetSession) {
    return res.status(201).send({ flag: req.app.locals.resetSession });
  }
  return res.status(440).send({ error: "Session expired" });
}

export async function resetPassword(req, res) {
  try {
    if (!req.app.locals.resetSession)
      return res.status(440).send({ error: "Session expired" });

    const { username, password } = req.body;

    try {
      UserModel.findOne({ username })
        .then((user) => {
          bcrypt
            .hash(password, 10)
            .then((hashedPassword) => {
              UserModel.updateOne(
                { username: user.username },
                { password: hashedPassword }
              );
              return res.status(201).send({ msg: "Record Updated!" });
            })
            .catch((err) => {
              return res.status(500).send({ error: "Enable to hash password" });
            });
        })
        .catch((err) => {
          return res.status(404).send({ error: "User not found" });
        });
    } catch (error) {
      return res.status(500).send({ error });
    }
  } catch (error) {
    return res.status(401).send({ error });
  }
}

/*
 {
  "username":"example123",
  "password":"admin123",
  "email":"example@gmail.com",
  "firstName":"bill",
  "lastName":"willion",
  "mobile":1234567890,
  "address":"apt. 556, kulas",
  "profile":""
}
*/
