import { render, screen } from '@testing-library/react'
import Input from '../Input'
import userEvent from '@testing-library/user-event'

const mock = jest.fn((str) => {})
const init = { title: 'Mark', value: '1', setValue: mock }

describe('Render', () => {
  it('should render offseted content', () => {
    render(<Input {...init} />)
    const input = screen.getByTestId(`input`)
    expect(input.classList).toContain('input__content--offset')
  })
  it('should render visible subtitle', () => {
    render(<Input {...init} />)
    const subtitle = screen.getByTestId(`subtitle`)
    expect(subtitle.classList).toContain('input__subtitle--visible')
  })
})

describe('Behavior', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call setValue', async () => {
    render(<Input {...init} />)
    const input = screen.getByTestId(`input`)

    await userEvent.type(input, '123')
    expect(init.setValue).toHaveBeenCalledTimes(3)
  })

  it('should not call setValue', async () => {
    render(<Input {...init} />)
    const input = screen.getByTestId(`input`)

    await userEvent.type(input, 'qwe')
    expect(init.setValue).toHaveBeenCalledTimes(0)
  })
})
