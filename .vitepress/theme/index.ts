import type { Theme } from 'vitepress'
    return h(DefaultTheme.Layout, null, {
} satisfies Theme
import 'virtual:group-icons.css'
import 'vitepress-plugin-graphviz/style.css'
import Theme from '@voidzero-dev/vitepress-theme/src/vite'
import './styles.css'

// components
import AsideSponsors from './components/AsideSponsors.vue'
    return h((Theme as any).Layout, null, {
  enhanceApp(ctx: any) {
    const { app } = ctx
import ScrimbaLink from './components/ScrimbaLink.vue'


    Theme.enhanceApp(ctx)
}
    app.component('ScrimbaLink', ScrimbaLink)