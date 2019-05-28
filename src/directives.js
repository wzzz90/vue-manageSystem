
import store from './store'
const hasPermision = (code) => {
  let privileges = store.getters.privileges;
  
  return privileges.includes(code)
}
// 元素隐藏显示指令
export default {
  name: 'privilege',
  // 被绑定元素插入父节点时调用
  inserted (el, binding, vnode) {
    if(!hasPermision(binding.value) && !!el.parentNode) {
      el.parentNode.removeChild(el)
    }
    //store.getters.privileges.includes(binding.value) ? el.style.display="block" : el.style.display = 'none'
  },
  // 所在组件的 VNode 更新时调用
  update (el, binding, vnode) {
    if(!hasPermision(binding.value) && !!el.parentNode) {
      el.parentNode.removeChild(el)
    }
    //store.getters.privileges.includes(binding.value) ? el.style.display="block" : el.style.display = 'none'
  },
  // 指令所在组件的 VNode 及其子 VNode 全部更新后调用
  componentUpdated (el, binding, vnode) {
    
  },
  unbind (el, binding, vnode) {
    
  }
}