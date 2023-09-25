import { DataTypes, Model } from 'sequelize'
import CarModel from './CarModel.mjs'
import { id_car_generation_fn, id_car_model_fn } from '../constant.mjs'
import Announcement from './Announcement.mjs'

export class Generation extends Model {
  static init(sequelize) {
    return super.init(
      {
        id_car_generation: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        id_car_model: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING(128),
          allowNull: false,
          defaultValue: '',
        },
        year_begin: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        year_end: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        timestamps: false,
      }
    )
  }

  static assosiate() {
    Generation.belongsTo(CarModel, {
      foreignKey: 'id_car_model',
      targetKey: 'id_car_model',
    })
    Generation.hasMany(Announcement, {
      foreignKey: 'id_car_generation',
      sourceKey: 'id_car_generation',
    })
  }
}

export default Generation
