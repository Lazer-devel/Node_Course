import { DataTypes, Model } from 'sequelize'
import CarModel from './CarModel.mjs'

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
}

export default Generation
