import { DataTypes, Model } from 'sequelize'
import {
  id_car_generation_fn,
  id_car_mark_fn,
  id_car_model_fn,
} from '../constant.mjs'
import Generation from './Generation.mjs'
import CarModel from './CarModel.mjs'
import Mark from './Mark.mjs'
import User from './User.mjs'

export class Announcement extends Model {
  static init(sequelize) {
    return super.init(
      {
        id_announcement: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        id_user: {
          type: DataTypes.STRING(128),
          allowNull: false,
        },
        id_car_mark: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        id_car_model: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        id_car_generation: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        cost: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        year: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        comment: {
          type: DataTypes.STRING(1024),
          allowNull: false,
          defaultValue: '',
        },
        volume: {
          type: DataTypes.FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        city: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        mileage: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        fuel: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        transmission: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        body: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        date: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        photo_amount: {
          type: DataTypes.INTEGER,
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
    Announcement.belongsTo(Mark, {
      foreignKey: 'id_car_mark',
      targetKey: 'id_car_mark',
    })
    Announcement.belongsTo(CarModel, {
      foreignKey: 'id_car_model',
      targetKey: 'id_car_model',
    })
    Announcement.belongsTo(Generation, {
      foreignKey: 'id_car_generation',
      targetKey: 'id_car_generation',
    })
    Announcement.belongsTo(User, {
      foreignKey: 'id_user',
      targetKey: 'id',
    })
  }
}

export default Announcement
