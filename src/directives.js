
import store from './store'

// 元素隐藏显示指令
export default {
  name: 'privilege',
  // 只调用一次，指令第一次绑定到元素时调用
  bind (el, binding, vnode) {
    //store.getters.privileges.includes(binding.value) ? el.style.display="block" : el.style.display = 'none'
  },
  // 被绑定元素插入父节点时调用
  inserted (el, binding, vnode) {
    // console.log(store.getters.privileges)
    if(!store.getters.privileges.includes(binding.value)) {
      // console.log(el)
      el.parentNode.removeChild(el)
    }
    //store.getters.privileges.includes(binding.value) ? el.style.display="block" : el.style.display = 'none'
  },
  // 所在组件的 VNode 更新时调用
  update (el, binding, vnode) {
    // if(!store.getters.privileges.includes(binding.value)) {
    //   el.parentNode.removeChild(el)
    // }
    //store.getters.privileges.includes(binding.value) ? el.style.display="block" : el.style.display = 'none'
  },
  // 指令所在组件的 VNode 及其子 VNode 全部更新后调用
  componentUpdated (el, binding, vnode) {
    
  },
  unbind (el, binding, vnode) {
    
  }
}