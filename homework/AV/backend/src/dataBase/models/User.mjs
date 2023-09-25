import { DataTypes, Model } from 'sequelize'
import { login_fn } from '../constant.mjs'
import Session from './Session.mjs'

class User extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.STRING(128),
          primaryKey: true,
        },
        login: {
          type: DataTypes.STRING(128),
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING(128),
          defaultValue: '',
          allowNull: false,
        },
        isActivated: {
          type: DataTypes.TINYINT,
          allowNull: false,
        },
        regDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      {
        indexes: [
          {
            fields: ['login'],
          },
        ],
        sequelize,
        timestamps: false,
      }
    )
  }

  static assosiate() {
    User.hasMany(Session, {
      foreignKey: 'login',
      targetKey: 'login',
    })
  }
}

export default User
