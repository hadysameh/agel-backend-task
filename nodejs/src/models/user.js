import { Model } from "sequelize";
import { getHashed } from "../utils/bcrypt";
import bcrypt from "bcrypt";

const hashAndSetUserPassword = async (user) => {
  const inputPassword = user.getDataValue("password");
  const hashedPassword = await getHashed(inputPassword);
  user.set("password", hashedPassword);
};

export default (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // eslint-disable-next-line
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      userName: { type: DataTypes.STRING, allowNull: false },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: "User",
      hooks: {
        beforeCreate: async (user, options) => {
          await hashAndSetUserPassword(user);
        },
        beforeUpdate: async (user, options) => {
          await hashAndSetUserPassword(user);
        },
      },
    }
  );

  User.prototype.validatePassword = function (candidatePassword, userPassword) {
    return bcrypt.compareSync(candidatePassword, userPassword);
  };

  return User;
};
