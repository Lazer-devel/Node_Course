import { render, screen } from '@testing-library/react'
import AdList from '../AdList'

describe('Render', () => {
  const ads = [
    {
      id: 1,
      mark: 'audi',
      model: 'a4',
      generation: 'b9',
      cost: 10000,
      year: 2015,
      comment: 'good car',
      volume: 2.0,
      city: 'minsk',
      mileage: 100000,
      fuel: 'бензин',
      transmission: 'автомат',
      body: 'седан',
      date: new Date().getDate(),
      markId: 1,
      modelId: 2,
      generationId: 3,
    },
    {
      id: 2,
      mark: 'audi',
      model: 'a4',
      generation: 'b9',
      cost: 10000,
      year: 2015,
      comment: 'good car',
      volume: 2.0,
      city: 'minsk',
      mileage: 100000,
      fuel: 'бензин',
      transmission: 'автомат',
      body: 'седан',
      date: new Date().getDate(),
      markId: 1,
      modelId: 2,
      generationId: 3,
    },
  ]
  it('should render header "Найдено 2 объявления"', () => {
    render(<AdList ads={ads} />)
    const header = screen.getByTestId(`header`)
    expect(header.textContent).toMatch(`Найдено ${ads.length} объявления`)
  })

  it('should render ads list with 2 children', () => {
    render(<AdList ads={ads} />)
    const adList = screen.getByTestId(`ads-list`)
    expect(adList.children.length).toEqual(ads.length)
  })
})
