import Filter from './Filter'
import './content.scss'
import { sliceArr } from './utils'

function Content() {
  const createCatalogList = () => {
    const createCatalogColumn = (cars) => {
      return (
        <ul className="catalog__items">
          {cars.map((c) => (
            <li key={c.brand} className="catalog__item">
              <a className="catalog__link" href="/" title={c.brand}>
                <span className="catalog__title">{c.brand}</span>
                <span className="catalog__amount">{c.amount}</span>
              </a>
            </li>
          ))}
        </ul>
      )
    }
    return (
      <div className="catalog__list">
        {sliceArr(cars, 6).map((arr) => createCatalogColumn(arr))}
      </div>
    )
  }
  return (
    <div className="content">
      <div className="content__layout">
        <div className="general">
          <h1 className="general__header">
            65&thinsp;974 объявления о&nbsp;продаже авто в&nbsp;Беларуси
          </h1>
        </div>
        <div className="catalog">{createCatalogList()}</div>
        <Filter brands={cars.map((c) => c.brand)} />
      </div>
    </div>
  )
}

export default Content

const cars = [
  {
    brand: 'Alfa Romeo',
    amount: 215,
  },
  {
    brand: 'Audi',
    amount: 141,
  },
  {
    brand: 'BMW',
    amount: 421,
  },
  {
    brand: 'Chevrolet',
    amount: 412,
  },
  {
    brand: 'Chrysler',
    amount: 14,
  },
  {
    brand: 'Citroen',
    amount: 14,
  },
  {
    brand: 'Dodge',
    amount: 14,
  },
  {
    brand: 'Fiat',
    amount: 41,
  },
  {
    brand: 'Ford',
    amount: 215,
  },
  {
    brand: 'Geely',
    amount: 141,
  },
  {
    brand: 'Honda',
    amount: 421,
  },
  {
    brand: 'Hyundai',
    amount: 412,
  },
  {
    brand: 'Infiniti',
    amount: 14,
  },
  {
    brand: 'Kia',
    amount: 41,
  },
  {
    brand: 'LADA(ВАЗ)',
    amount: 41,
  },
  {
    brand: 'Land Rover',
    amount: 41,
  },
  {
    brand: 'Lexus',
    amount: 41,
  },
  {
    brand: 'Mazda',
    amount: 41,
  },
  {
    brand: 'Mercedes-Benz',
    amount: 14,
  },
  {
    brand: 'Mitsubishi',
    amount: 41,
  },
  {
    brand: 'Nissan',
    amount: 41,
  },
  {
    brand: 'Opel',
    amount: 41,
  },
  {
    brand: 'Peugeot',
    amount: 41,
  },
  {
    brand: 'Renault',
    amount: 41,
  },
  {
    brand: 'Skoda',
    amount: 14,
  },
  {
    brand: 'Subary',
    amount: 41,
  },
  {
    brand: 'Tesla',
    amount: 41,
  },
  {
    brand: 'Toyota',
    amount: 41,
  },
  {
    brand: 'Volkswagen',
    amount: 41,
  },
  {
    brand: 'Volvo',
    amount: 41,
  },
]
