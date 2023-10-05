import { DataTypes, Model } from 'sequelize'
import User from './User.js'

class Session extends Model {
  static init(sequelize) {
    return super.init(
      {
        token: {
          type: DataTypes.STRING(128),
          primaryKey: true,
        },
        login: {
          type: DataTypes.STRING(128),
          defaultValue: '',
          allowNull: false,
        },
        lastAccess: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: false,
      }
    )
  }

  static assosiate() {
    Session.belongsTo(User, {
      foreignKey: 'login',
      targetKey: 'login',
    })
  }
}

export default Session
