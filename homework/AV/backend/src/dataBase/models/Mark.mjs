import { DataTypes, Model } from 'sequelize'

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
}

export default Mark
