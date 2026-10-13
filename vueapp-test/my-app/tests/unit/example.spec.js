import { shallowMount, mount } from '@vue/test-utils'
import MessageComponent from '@/components/MessageComponent.vue'
import App from '@/App.vue'

describe('MessageComponent', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message'
    const wrapper = shallowMount(MessageComponent, { propsData: { msg } })
    expect(wrapper.text()).toMatch(msg)
    wrapper.destroy()
  })

  it('updates the rendered message when the prop changes', async () => {
    const wrapper = shallowMount(MessageComponent, { propsData: { msg: 'first' } })
    await wrapper.setProps({ msg: 'second' })
    expect(wrapper.find('p').text()).toBe('second')
    wrapper.destroy()
  })

  it('renders safely without a message', () => {
    const wrapper = shallowMount(MessageComponent)
    expect(wrapper.find('p').text()).toBe('')
    wrapper.destroy()
  })
})

it('renders the assigned message through App and its child component', () => {
  const wrapper = mount(App)
  expect(wrapper.findComponent(MessageComponent).props('msg')).toBe('This is my first VUE app!')
  expect(wrapper.find('p').text()).toBe('This is my first VUE app!')
  wrapper.destroy()
})
