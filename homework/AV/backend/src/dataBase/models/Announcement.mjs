import { DataTypes, Model } from 'sequelize'

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
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
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
      },
      {
        sequelize,
        timestamps: false,
      }
    )
  }
}

export default Announcement
