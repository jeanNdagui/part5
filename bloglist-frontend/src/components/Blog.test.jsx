import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

test('component only display the blog\'s title and author by default',() => {
const b = {
    title:'sbd',
    author:'mani & ndagui',
    url:'dhghdg',
    likes: 50
  }

  const { container } = render(<Blog blog={b}/>)
  const title = container.querySelector('.title')
  const details = container.querySelector('.blog-details')

  expect(title).toHaveStyle('display: block')
  expect(details).toHaveStyle('display: none')
})

test("show details when the button controlling the shown details has been clicked", async () => {
  const b = {
    title:'sbd',
    author:'mani & ndagui',
    url:'dhghdg',
    likes: 50
  }


  const { container } = render(<Blog blog={b}/>)

  const user = userEvent.setup()

  const button = container.querySelector('.btn-view')

  const details = container.querySelector('.blog-details')
  
  await user.click(button)
  
  expect(details).toHaveStyle('display: none')
})

test.only(" if the like button is clicked twice, the event handler the component received as props is called twice.", async () => {
  const b = {
    title:'sbd',
    author:'mani & ndagui',
    url:'dhghdg',
    likes: 50
  }

  const mockHandler =  vi.fn()

  const { container } = render(<Blog blog={b} blogUpdate={mockHandler}/>)

  const user = userEvent.setup()

  const button = container.querySelector('.btn-like')

  
  await user.click(button)
  await user.click(button)
  
  expect(mockHandler.mock.calls).toHaveLength(2)
})