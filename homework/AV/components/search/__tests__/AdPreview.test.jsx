import { render, screen } from '@testing-library/react'
import AdPreview from '../AdPreview'

describe('Render', () => {
  const ad = {
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
  }
  it('should render link to Ad page', () => {
    render(<AdPreview ad={ad} />)
    const link = screen.getByText(`${ad.mark} ${ad.model} ${ad.generation}`)
    expect(link).toBeInTheDocument()
  })

  it(`should navigate to /catalog/${ad.mark}/${ad.model}/${ad.id} when link clicked`, () => {
    render(<AdPreview ad={ad} />)
    expect(
      screen.getByRole('link', {
        name: `${ad.mark} ${ad.model} ${ad.generation}`,
      })
    ).toHaveAttribute('href', `/catalog/${ad.mark}/${ad.model}/${ad.id}`)
  })

  it('should render car year', () => {
    render(<AdPreview ad={ad} />)
    const info = screen.getByText(`${ad.year} г.`)
    expect(info).toBeInTheDocument()
  })

  it('should render car description', () => {
    render(<AdPreview ad={ad} />)
    const info = screen.getByText(
      `${ad.transmission}, ${ad.volume} л, ${ad.fuel}, ${ad.body}.`
    )
    expect(info).toBeInTheDocument()
  })

  it('should render car mileage', () => {
    render(<AdPreview ad={ad} />)
    const info = screen.getByText(`${ad.mileage} км`)
    expect(info).toBeInTheDocument()
  })
  it('should render ad comment', () => {
    render(<AdPreview ad={ad} />)
    const info = screen.getByText(`${ad.comment}`)
    expect(info).toBeInTheDocument()
  })
  it('should render ad city', () => {
    render(<AdPreview ad={ad} />)
    const info = screen.getByText(`${ad.city}`)
    expect(info).toBeInTheDocument()
  })
  it('should render ad date', () => {
    render(<AdPreview ad={ad} />)
    const info = screen.getByText(`${ad.date}`)
    expect(info).toBeInTheDocument()
  })
})
