import loadable from '@loadable/component'

export const Home = loadable(() => import(/* webpackChunkName: 'home' */ './home'))
export const About = loadable(() => import(/* webpackChunkName: 'about' */ './about'))
export const Status404 = loadable(() => import(/* webpackChunkName: 'status404' */ './404'))
