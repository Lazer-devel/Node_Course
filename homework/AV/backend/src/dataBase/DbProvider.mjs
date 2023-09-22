import { Sequelize, Op, Model } from 'sequelize'
import { __dirname } from '../constants.mjs'
import fs from 'fs'
import path from 'path'

import Mark from './models/Mark.mjs'
import CarModel from './models/CarModel.mjs'
import Generation from './models/Generation.mjs'
import Announcement from './models/Announcement.mjs'

export default class DbProvider {
  static #sequelize

  static init() {
    const { dataBase, user, password, options } = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, '../dbConf.json'))
    )
    this.#sequelize = new Sequelize(dataBase, user, password, options)

    Mark.init(this.#sequelize)
    CarModel.init(this.#sequelize)
    Generation.init(this.#sequelize)
    Announcement.init(this.#sequelize)

    /* MARK AND CARMODEL */
    const mark_carModel_fn = {
      allowNull: false,
      defaultValue: 0,
      field: 'id_car_mark',
    }

    Mark.hasOne(CarModel, {
      foreignKey: mark_carModel_fn,
    })

    CarModel.belongsTo(Mark, {
      foreignKey: mark_carModel_fn,
    })

    /* CARMODEL AND GENERATION */
    const carModel_generation_fn = {
      allowNull: false,
      defaultValue: 0,
      field: 'id_car_model',
    }

    CarModel.hasOne(Generation, {
      foreignKey: carModel_generation_fn,
    })

    Generation.belongsTo(CarModel, {
      foreignKey: carModel_generation_fn,
    })

    /* ANNOUMENT AND MARK */
    const annoument_mark_fn = {
      allowNull: false,
      defaultValue: 0,
      field: 'id_car_mark',
    }

    Mark.hasOne(Announcement, {
      foreignKey: annoument_mark_fn,
    })

    Announcement.belongsTo(Mark, {
      foreignKey: annoument_mark_fn,
    })

    /* ANNOUMENT AND CarModel */
    const annoument_carModel_fn = {
      allowNull: false,
      defaultValue: 0,
      field: 'id_car_model',
    }

    CarModel.hasOne(Announcement, {
      foreignKey: annoument_carModel_fn,
    })

    Announcement.belongsTo(CarModel, {
      foreignKey: annoument_carModel_fn,
    })

    /* ANNOUMENT AND Generation */
    const annoument_generation_fn = {
      allowNull: false,
      defaultValue: 0,
      field: 'id_car_generation',
    }

    Generation.hasOne(Announcement, {
      foreignKey: annoument_generation_fn,
    })

    Announcement.belongsTo(Generation, {
      foreignKey: annoument_generation_fn,
    })
  }

  static async getAnnoumentsByMark() {
    const rows = await Mark.findAll({
      attributes: [
        'id_car_mark',
        ['name', 'mark'],
        [
          this.#sequelize.fn(
            'COUNT',
            this.#sequelize.col('Announcement.id_announcement')
          ),
          'amount',
        ],
      ],
      include: [
        {
          model: Announcement,
          required: false,
          attributes: [],
        },
      ],
      group: 'id_car_mark',
    })
    return rows.map((r) => {
      const { mark, amount } = r.toJSON()
      return { mark, amount }
    })
  }

  static async getAnnoumentsCount({
    mark,
    model,
    generation,
    beginYear,
    endYear,
    beginVolume,
    endVolume,
    beginCost,
    endCost,
  }) {
    const include = []
    const where = {}
    const year = {}
    const cost = {}
    const volume = {}

    mark &&
      include.push({
        model: Mark,
        required: true,
        attributes: ['name'],
        where: { name: mark },
      })

    model &&
      include.push({
        model: CarModel,
        required: true,
        attributes: [],
        where: { name: model },
      })

    generation &&
      include.push({
        model: Generation,
        required: true,
        attributes: [],
        where: { name: generation },
      })

    if (beginYear) {
      year[Op.gte] = beginYear
      where.year = year
    }

    if (endYear) {
      year[Op.lte] = endYear
      where.year = year
    }

    if (beginVolume) {
      volume[Op.gte] = beginVolume
      where.volume = volume
    }

    if (endVolume) {
      volume[Op.lte] = endVolume
      where.volume = volume
    }

    if (beginCost) {
      cost[Op.gte] = beginCost
      where.cost = cost
    }

    if (endCost) {
      cost[Op.lte] = endCost
      where.cost = cost
    }

    const amount = await Announcement.count({
      include,
      where,
    })
    return amount
  }

  static async getMarks() {
    const rows = await Mark.findAll({
      attributes: ['name'],
    })
    console.log(rows)
    return rows.map((r) => r.name)
  }

  static async getModels(mark) {
    const rows = await CarModel.findAll({
      attributes: ['name'],

      include: [
        {
          model: Mark,
          required: true,
          attributes: [],
          where: {
            name: mark,
          },
        },
      ],

      order: [['name', 'ASC']],
    })
    return rows.map(({ name }) => name)
  }

  static async getGenerations(mark, model) {
    const rows = await Generation.findAll({
      attributes: [
        'id_car_generation',
        'id_car_model',
        'name',
        'year_begin',
        'year_end',
      ],
      include: [
        {
          model: CarModel,
          required: true,
          attributes: [],
          where: {
            name: model,
          },
          include: [
            {
              model: Mark,
              required: true,
              attributes: [],
              where: {
                name: mark,
              },
            },
          ],
        },
      ],
      order: [['year_begin', 'ASC']],
    })
    return rows.map((r) => {
      return {
        name: r.name,
        beginYear: r.year_begin,
        endYear: r.year_end,
        id: `${r['id_car_generation']}${r['id_car_model']}`,
      }
    })
  }

  static async getAnnoumentsByModel(mark) {
    const rows = await Mark.findAll({
      attributes: [
        [
          this.#sequelize.fn('COUNT', this.#sequelize.col('id_announcement')),
          'amount',
        ],
      ],
      include: [
        {
          model: CarModel,
          required: true,
          attributes: ['name'],
          include: [
            {
              model: Announcement,
              attributes: [],
            },
          ],
        },
      ],
      where: {
        name: mark,
      },
      group: ['CarModel.name', 'CarModel.id_car_model'],
    })

    return rows.map((r) => {
      const { amount, CarModel } = r.toJSON()
      return {
        amount,
        model: CarModel.name,
      }
    })
  }
}
