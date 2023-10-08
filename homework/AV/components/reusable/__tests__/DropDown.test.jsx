import { render, screen } from '@testing-library/react'

import userEvent from '@testing-library/user-event'
import DropDown from '../DropDown'

const onSelect = jest.fn()

const initData_1 = {
  title: null,
  defaultTitle: 'марка',
  children: [],
  onSelect,
}
const initData_2 = {
  title: 'audi',
  defaultTitle: 'марка',
  children: ['1', '2', '3'],
  onSelect,
  contentFormat: 'table',
}

describe('Render', () => {
  it('should render child-wrapper as list', () => {
    render(<DropDown {...initData_1} />)
    const wrapper = screen.getByTestId(`child-wrapper`)
    expect(wrapper.classList).toContain('dropdown__content--list')
  })
  it('should render disabled button', () => {
    render(<DropDown {...initData_1} />)
    const button = screen.getByTestId(`button`)
    expect(button).toHaveAttribute('disabled')
  })

  it('should render child-wrapper as table', () => {
    render(<DropDown {...initData_2} />)
    const wrapper = screen.getByTestId(`child-wrapper`)
    expect(wrapper.classList).toContain('dropdown__content--table')
  })
  it('should render disabled button', () => {
    render(<DropDown {...initData_2} />)
    const button = screen.getByTestId(`button`)
    expect(button).not.toHaveAttribute('disabled')
  })
})
