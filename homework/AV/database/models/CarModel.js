import { DataTypes, Model } from 'sequelize'
import Mark from './Mark.js'
import Generation from './Generation.js'
import Announcement from './Announcement.js'

export class CarModel extends Model {
  static init(sequelize) {
    return super.init(
      {
        id_car_model: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        id_car_mark: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING(128),
          allowNull: false,
          defaultValue: '',
        },
      },
      {
        sequelize,
        tableName: 'Models',
        timestamps: false,
      }
    )
  }

  static assosiate() {
    CarModel.belongsTo(Mark, {
      foreignKey: 'id_car_mark',
      targetKey: 'id_car_mark',
    })

    CarModel.hasMany(Generation, {
      foreignKey: 'id_car_model',
      sourceKey: 'id_car_model',
    })

    CarModel.hasMany(Announcement, {
      foreignKey: 'id_car_model',
      sourceKey: 'id_car_model',
    })
  }
}

export default CarModel
