import { DataTypes, Model } from 'sequelize'

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
}

export default CarModel
