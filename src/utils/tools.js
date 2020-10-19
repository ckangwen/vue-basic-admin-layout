import { systemSettings } from '@/config/settings'
const { useI18n } = systemSettings

export const showTitle = (title, vm) => {
  if (useI18n) {
    if (title.includes('{{') && title.includes('}}') && useI18n) title = title.replace(/({{[\s\S]+?}})/, (m, str) => str.replace(/{{([\s\S]*)}}/, (m, _) => vm.$t(_.trim())))
    else title = vm.$t(title)
  }
  return title
}
