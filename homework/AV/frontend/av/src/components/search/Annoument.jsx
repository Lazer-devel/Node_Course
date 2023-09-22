import './announment.scss'

function Announment() {
  return (
    <li className="announment">
      <img
        className="announment__img"
        src={`http://localhost:55555/generations/71.jpeg`}
        alt=""
        width="200px"
        height="200px"
        style={{ objectFit: 'cover' }}
      />
      <a className="announment__title" href="/">
        BMW 3 серия E46 · Рестайлинг
      </a>
      <div className="announment__about">
        <span className="announment__year">2001 г.</span>
        <span className="announment__description">
          механика, 2.0 л, бензин, хэтчбек 3 дв.
        </span>
        <span className="announment__mileage">230 000 км</span>
      </div>
      <div className="announment__price-wrapper">
        <span className="announment__price">213&thinsp;537&nbsp;р.</span>
      </div>
      <span className="announment__comment">
        -Из Германии -Без пробега по рб -2019 год тех паспорту -Не был в ДТП
        -Оригинальный краска -Оригинальный подтвержденный пробег -На 147.500 тыс
        заменено -масло в моторе и коробке , фильтра салона , топливный
        воздушный , тормозные колодки .масло в редукторе . Обслужен полностью ,
        сделана химчистка салона , полировка кузова с нанесением керамики
        -Лазерные фары BMW Laser Light -M пакет -проекция на лобовое -21 диски
        m+s -Камера заднего вида -Car play -Акустика Harman Cardon -Управление
        жестами -Подогрев сидений и руля -Спорт сидения -Отделка под дерево
        -Контурная подсветка салона -Электро Фаркоп -Автоматический дальный
        -Беспроводное зарядное -USB и type c разьемы -Подстаканник с подогревом
        и охлаждением -Черный потолок - спортивные перфорированные м тормоза -2
        ключа ( 1 ключ с экраном ) - датчик слепых зон - датчик света и дождя -
        направление по полосе и подруливание -память сидений -дистроник
        -управление мультимедиа жестами -авто парковка -проекция на лобовое
        стекло -без ключевой доступ -электро багажник с кнопки и с «движением
        ноги « - парктроник оптический передний и задний -тонировка AS3 В салон
        не поставлю не звонить !
      </span>
      <div className="announment__info">
        <span className="announment__location">Гомель</span>
        <span className="announment__date">5 дней назад</span>
      </div>
    </li>
  )
}

export default Announment
