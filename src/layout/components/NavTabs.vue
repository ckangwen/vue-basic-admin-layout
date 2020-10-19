<template>
  <div class="tag-view-group-container">
    <div class="tag-view-group-content" flex-box="1">
      <div class="tag-view-group-content-inner">
        <click-menu-context
          :visible.sync="showClickMenu"
          :x="contentmenuX"
          :y="contentmenuY"
        >
          <click-menu
            :list="tabName === 'index' ? contextMenuList.slice(contextMenuList.length - 1) : contextMenuList"
            @rowClick="contextMenuClick">
          </click-menu>
        </click-menu-context>
        <div class="tag-view-container">
          <div
            :class="[
              'tag-view-item',
              'tag-view--fixed',
              current === item.name ? 'tag-view--active' : ''
            ]"
            v-for="(item) in fixedTag"
            :key="item.name"
            :data-name="item.name"
            @click.stop="handleClickTab(item, $event)"
            @contextmenu.prevent="handleContextmenu"
          >
            {{ item.meta && item.meta.title || item.name }}
            <span class="el-icon-close" @click="removeTab(item.name)"></span>
          </div>
          <div
            :class="[
              'tag-view-item',
              current === item.name ? 'tag-view--active' : ''
            ]"
            v-for="(item) in opened.slice(1)"
            :key="item.name"
            :data-name="item.name"
            @click="handleClickTab(item, $event)"
            @contextmenu.prevent="handleContextmenu"
          >
            {{ item.meta && item.meta.title || item.name }}
            <span class="el-icon-close" @click="removeTab(item.name)"></span>
          </div>
        </div>
      </div>
    </div>
    <div class="tag-view-group-extra">
      <el-dropdown
        size="default"
        @command="handleControlItemClick">
        <el-button :style="{
          height: '42px',
          background: 'inherit',
          borderBottomRightRadius: 0,
          borderBottomLeftRadius: 0,
          border: 0
        }" size="medium" icon="el-icon-circle-close"></el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item) in contextMenuList" :key="item.value" :command="item.value">
            <span>{{ showTitle(item.title) }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { showTitle } from '@/utils/tools'
export default {
  name: 'NavTabs',
  components: {
    ClickMenuContext: () => import('./ClickMenuContext'),
    ClickMenu: () => import('./ClickMenu')
  },
  data () {
    return {
      contextMenuList: [
        { icon: 'arrow-left', title: '关闭左侧', value: 'left' },
        { icon: 'arrow-right', title: '关闭右侧', value: 'right' },
        { icon: 'close', title: '关闭其它', value: 'others' },
        { icon: 'circle-close', title: '关闭全部', value: 'all' }
      ],
      fixedTag: [
        {
          path: 'index',
          name: 'Home',
          meta: {
            title: '首页'
          }
        }
      ],
      showClickMenu: false,
      contentmenuX: 0,
      contentmenuY: 0,
      tabName: null
    }
  },
  computed: {
    ...mapState('page', [
      'opened',
      'current'
    ])
  },
  methods: {
    ...mapActions('page', [
      'close',
      'closeLeft',
      'closeRight',
      'closeOthers',
      'closeAll'
    ]),
    handleControlItemClick (command) {
      this.closeMethods(command)
    },
    contextMenuClick (value) {
      this.showClickMenu = false
      this.closeMethods(value, this.tabName)
    },
    handleContextmenu (e) {
      const target = e.target
      const tabName = target && target.dataset && target.dataset.name
      if (tabName) {
        this.contentmenuX = e.clientX
        this.contentmenuY = e.clientY
        this.tabName = tabName
        this.showClickMenu = true
      }
    },
    closeMethods (type, tabName) {
      switch (type) {
        case 'left':
          this.closeLeft(tabName)
          break
        case 'right':
          this.closeRight(tabName)
          break
        case 'others':
          this.closeOthers(tabName)
          break
        case 'all':
          this.closeAll()
          break
      }
    },
    handleClickTab (tab, e) {
      const page = this.opened.find(t => t.name === tab.name)
      if (page) {
        const { name, params, query } = page
        this.$router.push({
          name,
          params,
          query
        })
      }
    },
    removeTab (tabName) {
      this.close(tabName)
    },
    showTitle (item) {
      return showTitle(item, this)
    }
  }
}
</script>
<style lang="scss">
.tag-view-container {
  white-space: nowrap;
  position: relative;
  transition: transform .3s;
  float: left;
  z-index: 2;
  border: 1px solid #e4e7ed;
  border-bottom: 0;
  border-radius: 4px 4px 0 0;
  box-sizing: border-box;

  .tag-view-item {
    position: relative;
    padding: 0 20px;
    height: 40px;
    box-sizing: border-box;
    line-height: 40px;
    display: inline-block;
    list-style: none;
    color: #303133;

    border-bottom: 1px solid transparent;
    border-left: 1px solid #E4E7ED;
    transition: color .3s cubic-bezier(.645,.045,.355,1),padding .3s cubic-bezier(.645,.045,.355,1);
    cursor: pointer;

    &:first-child {
      border-left: 0;
    }
    &:not(.tag-view--fixed):hover .el-icon-close {
      width: 14px;
      background-color: #ccc;
      color: #fff;
    }
    &.tag-view--active {
      color: #409eff;
    }

    .el-icon-close {
      position: relative;
      font-size: 12px;
      width: 0;
      height: 14px;
      vertical-align: middle;
      line-height: 15px;
      overflow: hidden;
      transform-origin: 100% 50%;

      border-radius: 50%;
      text-align: center;
      transition: all .3s cubic-bezier(.645,.045,.355,1);
      margin-left: 5px;
    }
  }
}

</style>
