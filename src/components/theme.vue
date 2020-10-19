<template>
  <span class="top-header-extra-block">
    <el-dropdown placement="bottom" size="small" @command="onChangeTheme">
      <i class="el-icon-set-up"></i>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="item in themeList"
          :key="item.value"
          :style="{
            color: activeTheme === item.value ? '#177ddc' : undefined,
          }"
          :command="item.value"
        >
          {{ item.text }}
        </el-dropdown-item>
        <el-dropdown-item command="custom">自定义主题</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog center :visible.sync="themeDialogVisible" width="400px">
      <div>选择主题</div>
      <el-color-picker v-model="color"></el-color-picker>
    </el-dialog>
  </span>
</template>

<script>
import { themeList } from '@/config/settings'
import { mapState, mapActions } from 'vuex'
import {
  getStyleTemplate,
  getFile,
  getColorClusterMap
} from '@/libs/change-theme'
const defaultColor = '#409eff'
export default {
  name: 'change-theme-component',
  data () {
    return {
      themeList,
      color: defaultColor,
      styleId: 'el-chalk-style',
      originalStylesheetCount: -1,
      originalStyle: '',
      styleTemplate: '',
      colorMap: {},
      themeDialogVisible: false
    }
  },
  computed: {
    ...mapState('theme', ['activeTheme'])
  },
  methods: {
    ...mapActions('theme', ['updateTheme']),
    onChangeTheme (theme) {
      if (theme === 'custom') {
        this.themeDialogVisible = true
        return
      }
      this.updateTheme(theme)
    },
    writeNewStyle () {
      let cssText = this.styleTemplate
      if (!cssText) return
      Object.keys(this.colorMap).forEach((key) => {
        cssText = cssText.replace(
          new RegExp('(:|\\s+)' + this.colorMap[key], 'g'),
          '$1' + key
        )
      })

      let styleTag = document.getElementById(this.styleId)
      if (!styleTag) {
        styleTag = document.createElement('style')
        styleTag.setAttribute('id', this.styleId)
        document.head.appendChild(styleTag)
      }
      styleTag.innerText = cssText
    },
    getIndexStyle () {
      getFile('https://unpkg.com/element-ui/lib/theme-chalk/index.css').then(
        ({ data }) => {
          this.originalStyle = data
          this.styleTemplate = getStyleTemplate(this.color, data)
        }
      )
    }
  },
  watch: {
    color: {
      handler: async function (val, oldVal) {
        if (val === oldVal) return
        this.colorMap = getColorClusterMap(val)
        if (val !== defaultColor) {
          this.writeNewStyle()
        }
      },
      immediate: true
    }
  },
  created () {
    this.colorMap = getColorClusterMap(this.color)
    this.getIndexStyle()
  }
}
</script>
