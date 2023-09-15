import { createAgeArr, createVolumeArr } from './utils'

import './filter.scss'
import DropDown from '../general/DropDown'
import Input from '../general/Input'

function Filter({ brands }) {
  return (
    <div className="filter">
      <h2 className="filter__title"> Поиск по параметрам</h2>
      <div className="filter__main-info">
        <div className="filter__field">
          <div className="filter__field-controls">
            <div className="filter__field-control">
              <DropDown
                initData={{ defaultTitle: 'Марка', children: brands }}
              />
            </div>
          </div>
        </div>
        <div className="filter__field">
          <div className="filter__field-controls">
            <div className="filter__field-control">
              <DropDown
                initData={{
                  defaultTitle: 'Модель',
                  children: ['A5', 'A6', 'A7', 'A8'],
                }}
              />
            </div>
          </div>
        </div>
        <div className="filter__field">
          <div className="filter__field-controls">
            <div className="filter__field-control">
              <DropDown
                initData={{
                  defaultTitle: 'Поколение',
                  children: ['A5', 'A6', 'A7', 'A8'],
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="filter__secondary">
        <div className="filter__field">
          <div className="filter__field-controls">
            <div className="filter__field-control">
              <DropDown
                initData={{
                  defaultTitle: 'Год от',
                  children: createAgeArr(),
                }}
              />
            </div>
            <div className="filter__field-control">
              <DropDown
                initData={{
                  defaultTitle: 'До',
                  children: createAgeArr(),
                }}
              />
            </div>
          </div>
        </div>
        <div className="filter__field">
          <div className="filter__field-controls">
            <div className="filter__field-control">
              <Input title={'Цена от'} />
            </div>
            <div className="filter__field-control">
              <Input title={'до'} />
            </div>
            <div className="filter__field-control">
              <DropDown
                initData={{
                  defaultTitle: 'Валюта',
                  children: ['USD', 'BYN'],
                  isSelected: true,
                }}
              />
            </div>
          </div>
        </div>
        <div className="filter__field">
          <div className="filter__field-controls">
            <div className="filter__field-control">
              <DropDown
                initData={{
                  defaultTitle: 'Объём от',
                  children: createVolumeArr(),
                }}
              />
            </div>
            <div className="filter__field-control">
              <DropDown
                initData={{
                  defaultTitle: 'До',
                  children: createVolumeArr(),
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="filter__control">
        <button className="filter__show">Показать 65948 объявления</button>
      </div>
    </div>
  )
}

export default Filter
