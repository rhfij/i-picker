import Vue from 'vue'
import Modal from '../components/Modal.vue'
import context from './context'

const defaultConfig = {
  className: '',
  customStyle: {}
}

export default {
  open (vm, config) {
    if (!context.stack.some(item => item.vm.POPUP_ID === vm.POPUP_ID)) {
      const el = vm.$el
      const targetNode = el && el.parentNode && el.parentNode.nodeType !== 11 ? el.parentNode : document.body
      context.stack.push({ vm, config, targetNode })
      this.update()
    }
  },

  close (id) {
    const { stack } = context

    if (stack.length) {
      if (context.top.vm.POPUP_ID === id) {
        stack.pop()
        this.update()
      } else {
        context.stack = stack.filter(item => item.vm.POPUP_ID !== id)
      }
    }
  },

  update () {
    let { modal } = context

    if (!modal) {
      modal = new (Vue.extend(Modal))({
        el: document.createElement('div')
      })
      modal.$on('click', this.onClick)

      context.modal = modal
    }

    if (modal.$el.parentNode) {
      modal.visible = false
    }

    if (context.top) {
      const { targetNode, config } = context.top

      targetNode.appendChild(modal.$el)
      Object.assign(modal, {
        ...defaultConfig,
        ...config,
        visible: true
      })
    }
  },

  onClick () {
    if (context.top) {
      const { vm } = context.top
      vm.$emit('click-overlay')
      if (vm.closeOnClickOverlay) {
        vm.close()
      }
    }
  }
}
