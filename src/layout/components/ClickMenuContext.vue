<template>
  <div class="click-menu-context" v-show="flag" :style="style">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'click-menu-context',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    x: {
      type: Number,
      default: 0
    },
    y: {
      type: Number,
      default: 0
    }
  },
  computed: {
    flag: {
      get () {
        if (this.visible) {
          window.addEventListener('mousedown', this.watchMenuContext)
        }
        return this.visible
      },
      set (newVal) {
        // 对`visible`进行"双向绑定"
        this.$emit('update:visible', newVal)
      }
    },
    style () {
      return {
        left: `${this.x}px`,
        top: `${this.y}px`,
        display: this.visible ? 'block' : 'none'
      }
    }
  },
  methods: {
    watchMenuContext (e) {
      if (!this.$el.contains(e.target) || e.button !== 0) {
        this.flag = false
      }
      window.removeEventListener('mousedown', this.watchMenuContext)
    }
  },
  mounted () {
    // 将菜单置于body之下
    document.querySelector('body').appendChild(this.$el)
  }
}
</script>
<style lang="scss" scoped>
.click-menu-context {
  position: absolute;
  padding: 5px 0;
  background: #FFF;
  border: 1px solid #cfd7e5;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  z-index: 1000;
}
</style>
