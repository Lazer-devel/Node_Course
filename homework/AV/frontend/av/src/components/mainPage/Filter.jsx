function Filter() {
  return (
    <div className="filter">
      <h2 className="filter__title"> Поиск по параметрам</h2>

      <div className="filter__main-info">
        <button className="filter__dropdown">
          <span className="filter__dropdown-value">Марка</span>
        </button>
        <button className="filter__dropdown">
          <span className="filter__dropdown-value">Модель</span>
        </button>
        <button className="filter__dropdown">
          <span className="filter__dropdown-value">Поколение</span>
        </button>
      </div>

      <div className="filter__params">
        <button className="filter__dropdown">
          <span className="filter__dropdown-value">Марка</span>
        </button>
        <button className="filter__dropdown">
          <span className="filter__dropdown-value">Марка</span>
        </button>
        <button className="filter__dropdown">
          <span className="filter__dropdown-value">Марка</span>
        </button>
      </div>

      <div className="filter__control">
        <button className="filter__show">Показать 65948 объявления</button>
      </div>
    </div>
  )
}

export default Filter
