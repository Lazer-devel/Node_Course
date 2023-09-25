import { DataTypes, Model } from 'sequelize'
import { id_car_mark_fn } from '../constant.mjs'
import Announcement from './Announcement.mjs'
import CarModel from './CarModel.mjs'

class Mark extends Model {
  static init(sequelize) {
    return super.init(
      {
        id_car_mark: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING(128),
          defaultValue: '',
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
    Mark.hasMany(CarModel, {
      foreignKey: 'id_car_mark',
      sourceKey: 'id_car_mark',
    })

    Mark.hasMany(Announcement, {
      foreignKey: 'id_car_mark',
      sourceKey: 'id_car_mark',
    })
  }
}

export default Mark
