import { render, screen } from '@testing-library/react'
import LinkList from '../LinkList'

const links = [
  {
    title: 'audi',
    subtitle: '100',
    isInActive: false,
  },
  {
    title: 'bmw',
    subtitle: '0',
    isInActive: true,
  },
]
const initData = { commonUrl: 'http:localhost', links, className: 'mock-class' }

describe('Render', () => {
  it('should render 2 links', () => {
    render(<LinkList {...initData} />)
    const linkList = screen.getByTestId(`link-list`)
    expect(linkList.children.length).toEqual(2)
  })

  it('first link should be disabled', () => {
    render(<LinkList {...initData} />)
    const links = screen.getAllByTestId(`link`)
    expect(links[0].className).toEqual(
      'link-list__link link-list__link--disabled'
    )
  })

  it('second link should be active', () => {
    render(<LinkList {...initData} />)
    const links = screen.getAllByTestId(`link`)
    expect(links[1].className).toEqual('link-list__link ')
  })
})
