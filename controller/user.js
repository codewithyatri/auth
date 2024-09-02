
const db = require('../model')
const User = db.user;
const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const config = require('../configs/config')

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  firstName: Joi.string().min(1).required(),
  lastName: Joi.string().min(1).required(),
  password: Joi.string().min(6).required()
});

const postUsers = async (req, res) => {
  try {
    // Validate using Joi schema
    const { error, value } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: 'Validation error', error: error.details[0].message });
    }

    // Validate required fields
    const { email, firstName, lastName, password } = value;
    //is user exists

    const saltRound = 10;
    const hash_password = await bcrypt.hash(password, saltRound);

    const userObj = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      password: hash_password
    }
    const data = await User.create(userObj);

    res.status(200).json({ message: 'user created ', data: data });

  } catch (error) {
    console.error('Error creating user:', error);
    res.status(200).json({ message: 'Failed to create user ', error: true });
  }
};

// joi validation
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});
const login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: 'Validation error', error: error.details[0].message});
    }
    const { email, password } = value;
    // Find user by firstName
    const user = await User.findOne({
      where: {
        email: email
      },
      raw:true
    });

    if (!user) {
      // User not found
      return res.status(401).json({ message: 'user not found', error: true });
    }

    // Compare provided password with hashed password stored in the database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      // Passwords do not match
      return res.status(401).json({ message: 'Invalid firstname or password', error: true });
    }
    const token = jwt.sign(
      {
          email: user.email,
        
          id: user.id
      },
     "werfa324rfaew32ra",
    
  );
  console.log("token",token);
  user.token = token;
    // Passwords match, proceed with login
    res.status(200).json({ message: 'Login successful', user: user });

  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(200).json({ message: 'Failed to login user', error: true });
  }
};

// const forgetPassword = async (req, res) => {
//   try {
//     const { email } = req.body;
//     if(!email) {
//       return res.status(400).send({ message: "please provide email" });
//     }

//     const checkUser = await User.findOne({ where: { email } });

//     if (!checkUser) {
//       return res.status(400).send({ message: "User not found, please register" });
//     }

    
//     // Create token for password reset
//     const token = jwt.sign({ email }, config.JWT_SECRET, { expiresIn: "1h" });

//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.MAIL_USERNAME,
//         pass: process.env.MAIL_PASSWORD   
//       }
//     });

//     const receiver ={
//       from: "ravalyatri2910@gmail.com",
//       to: email,
//       subject: "password reset request",
//       text:`Clik on this link to reset your password: http://localhost:3000/users/resetpassword?token=${token}`,
//     }

//     await transporter.sendMail(receiver);
//     return res.status(200).send({ message: "Reset password link sent successfully to your email" });

//   } catch (error) {
//     console.log(error)
//     return res.status(200).send({message: "somthing went wrong"});
//   }
// }

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).send({ message: "Please provide email" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).send({ message: "User not found, please register" });
    }

    // Generate OTP and save
    const otp = generateOtp();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 15);
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();
    

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD   
      }
    });

    const mailOptions = {
      from: process.env.MAIL_USERNAME,
      to: email,
      subject: "Password reset request",
      text: `Your password reset OTP is ${otp}`,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).send({ message: "Reset OTP sent successfully to your email" });

  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Something went wrong" });
  }
}


const resetpassword = async (req, res) => {
  try {
    const { otp, newPassword } = req.body;

    // Find the user by OTP
    const user = await User.findOne({ where: { otp } });


    // Find the user
    if (!user) {
      return res.status(400).send({ message: "User not found" });
    }

    // Check OTP validity
    if (user.otp !== otp) {
      return res.status(400).send({ message: "Invalid OTP" });
    }

    const otpExpiry = user.otpExpiry; // Assuming you have saved otpExpiry to user

    if (!otpExpiry || new Date() > new Date(otpExpiry)) {
      return res.status(400).send({ message: "OTP has expired" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    user.password = hashedPassword;
    user.otp = null; // Clear OTP
    user.otpExpiry = null; // Clear OTP expiry
    await user.save();

    return res.status(200).send({ message: "Password reset successfully" });

  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Something went wrong" });
  }
}
const profile = async(req, res) => {
  return res.status(200).send({ message: "profile" });
}

module.exports = {
  postUsers: postUsers,
  login: login,
  forgetPassword: forgetPassword,
  resetpassword: resetpassword,
  profile:profile
}





