import { Sequelize, Op, Model, where } from 'sequelize'
import { __dirname } from '../constants.mjs'
import fs from 'fs'
import path from 'path'
import Mark from './models/Mark.mjs'
import CarModel from './models/CarModel.mjs'
import Generation from './models/Generation.mjs'
import Announcement from './models/Announcement.mjs'
import User from './models/User.mjs'
import Session from './models/Session.mjs'

export default class DbProvider {
  static #sequelize

  static init() {
    const { dataBase, user, password, options } = JSON.parse(
      fs.readFileSync(path.join(__dirname, '/dataBase/dbConf.json'))
    )
    this.#sequelize = new Sequelize(dataBase, user, password, options)

    const models = [Mark, CarModel, Generation, Announcement, User, Session]
    models
      .map((model) => model.init(this.#sequelize))
      .forEach((model) => model.assosiate())
  }
  static async getAnnoumentsByMark() {
    const rows = await Mark.findAll({
      attributes: [
        'id_car_mark',
        ['name', 'mark'],
        [
          this.#sequelize.fn(
            'COUNT',
            this.#sequelize.col('Announcements.id_announcement')
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

  static async getMarks() {
    const rows = await Mark.findAll({
      attributes: ['name'],
    })
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
    const rows = await CarModel.findAll({
      attributes: [
        'name',
        [
          this.#sequelize.fn('COUNT', this.#sequelize.col('id_announcement')),
          'amount',
        ],
      ],
      include: [
        {
          model: Mark,
          required: true,
          attributes: [],
          where: {
            name: mark,
          },
        },
        {
          model: Announcement,
          attributes: [],
        },
      ],
      group: ['name', 'id_car_model'],
    })

    return rows.map((r) => {
      const { name, amount } = r.toJSON()
      return {
        amount,
        model: name,
      }
    })
  }

  static async isUserExist(login) {
    const isUserExist = await User.count({
      attributes: [],
      where: {
        login,
      },
    })
    return !!isUserExist
  }

  static async regUser(id, login, password) {
    await User.create({
      id,
      login,
      password,
      isActivated: 0,
      regDate: Sequelize.fn('NOW'),
    })
  }

  static async isUserActivated(id) {
    const user = await User.findOne({
      attributes: ['isActivated'],
      where: {
        id,
      },
    })
    return !!user.isActivated
  }

  static async setUserActive(id) {
    await User.update(
      {
        isActivated: 1,
      },
      {
        where: {
          id,
        },
      }
    )
  }

  static async getUser(login, password) {
    const user = await User.findOne({
      attributes: ['login', 'password', 'isActivated'],
      where: { login, password },
    })
    return user && user.toJSON()
  }

  static async createSession(login, token) {
    await Session.create({
      token,
      login,
      lastAccess: Sequelize.fn('NOW'),
    })
  }

  static async getAds({
    mark,
    model,
    generation,
    id,
    beginYear,
    endYear,
    beginVolume,
    endVolume,
    beginCost,
    endCost,
  }) {
    const where = {}
    const markWhere = {}
    const modelWhere = {}
    const generationWhere = {}
    const year = {}
    const cost = {}
    const volume = {}

    if (mark) {
      markWhere.name = mark
    }

    if (model) {
      modelWhere.name = model
    }

    if (generation) {
      generationWhere.name = generation
    }

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

    if (id) {
      where.id_announcement = id
    }
    return await Announcement.findAll({
      raw: true,
      attributes: [
        ['id_announcement', 'id'],
        'cost',
        'year',
        'comment',
        'volume',
        'city',
        'mileage',
        'fuel',
        'transmission',
        'body',
        'date',
        'photo_amount',
        ['id_car_mark', 'markId'],
        ['id_car_model', 'modelId'],
        ['id_car_generation', 'generationId'],
        [this.#sequelize.col('Mark.name'), 'mark'],
        [this.#sequelize.col('CarModel.name'), 'model'],
        [this.#sequelize.col('Generation.name'), 'generation'],
      ],
      where,
      include: [
        {
          model: Mark,
          required: true,
          attributes: [],
          where: markWhere,
        },
        {
          model: CarModel,
          required: true,
          attributes: [],
          where: modelWhere,
        },
        {
          model: Generation,
          required: true,
          attributes: [],
          where: generationWhere,
        },
      ],
    })
  }

  static async isSessionExist(token) {
    const user = await Session.findOne({
      attributes: [[this.#sequelize.col('User.login'), 'login']],

      include: [
        {
          model: User,
          require: true,
          attributes: [],
        },
      ],
      where: {
        token,
      },
    })
    return user.login
  }

  static async getMarkIdByName(mark) {
    return (
      await Mark.findOne({
        attributes: ['id_car_mark'],
        where: {
          name: mark,
        },
      })
    ).toJSON().id_car_mark
  }

  static async getModelIdByName(model) {
    return (
      await CarModel.findOne({
        attributes: ['id_car_model'],
        where: {
          name: model,
        },
      })
    ).toJSON().id_car_model
  }

  static async getGenerationIdByName(generation) {
    return (
      await Generation.findOne({
        attributes: ['id_car_generation'],
        where: {
          name: generation,
        },
      })
    ).toJSON().id_car_generation
  }

  static async createAd(
    token,
    id,
    id_car_mark,
    id_car_model,
    id_car_generation,
    year,
    volume,
    cost,
    comment,
    photo_amount
  ) {
    const id_user = (
      await Session.findOne({
        attributes: [[this.#sequelize.col('User.id'), 'id_user']],
        include: [
          {
            model: User,
            required: true,
            attributes: [],
          },
        ],
        where: {
          token,
        },
      })
    ).toJSON().id_user

    Announcement.create({
      id_announcement: id,
      id_user,
      id_car_mark,
      id_car_model,
      id_car_generation,
      year,
      volume,
      cost,
      comment,
      city: 'Минск',
      mileage: 100000,
      fuel: 'Дизель',
      transmission: 'Автомат',
      body: 'Седан',
      date: Sequelize.fn('NOW'),
      photo_amount,
    })
  }
}
