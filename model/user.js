module.exports = (sequelize, DataTypes, Model) => {
  class user extends Model { }

  user.init(
    {
      // Model attributes are defined here
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        // allowNull defaults to true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      otp: {
        type: DataTypes.STRING,
        allowNull: true
      },
      otpExpiry: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      // Other model options go here
      sequelize, // We need to pass the connection instance
      modelName: 'user', // We need to choose the model name
    });
  return user;
}
