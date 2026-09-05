import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import './custom.css'

import Layout from './Layout.vue'
import InstallTabs from '../components/InstallTabs.vue'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('InstallTabs', InstallTabs)
  },
} satisfies Theme
