<template>
  <div class="click-menu-list" @click="rowClick">
    <div
      v-for="(item) in list"
      :key="item.value"
      :data-value="item.value"
      class="click-menu-item"
    >
      <span class="click-menu-item-title">
        {{ item.title }}
      </span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'click-menu-list',
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    rowClick (e) {
      let target = e.target
      while (!target.dataset.value) {
        target = target.parentNode
      }
      this.$emit('rowClick', target.dataset.value)
    }
  }
}
</script>
<style lang="scss" scoped>
.click-menu-list {
  .click-menu-item {
    padding: 8px 20px 8px 15px;
    margin: 0;
    font-size: 14px;
    color: #606266;
    cursor: pointer;
    &:hover {
      background: #ecf5ff;
      color: #66b1ff;
    }
    &-title {
      margin-left: 5px;
    }
  }
}
</style>
