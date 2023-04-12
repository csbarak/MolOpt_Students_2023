// ** Next Imports
import Head from 'next/head'
import { Router } from 'next/router'
import React from 'react'

// ** Loader Import
import NProgress from 'nprogress'

// ** Emotion Imports
import { CacheProvider } from '@emotion/react'

// ** Config Imports
import themeConfig from 'src/configs/themeConfig'

// ** Component Imports
import UserLayout from 'src/components/user-layout'
import ThemeComponent from 'src/@core/theme/ThemeComponent'

// ** Contexts
import { SettingsConsumer, SettingsProvider } from 'src/context/settingsContext'

// ** Utils Imports
import { createEmotionCache } from 'src/utils/create-emotion-cache'

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css'
import 'react-notifications/lib/notifications.css'
import { NotificationContainer } from 'react-notifications'

// ** Global css styles
import '../../styles/globals.css'

const clientSideEmotionCache = createEmotionCache()

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

// ** Configure JSS & classNameName
const App = props => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props
  // Variables
  const getLayout = Component.getLayout ?? (page => <UserLayout>{page}</UserLayout>)

  return (
    <>
      <CacheProvider value={emotionCache}>
        <Head>
          <title>{`${themeConfig.templateName} - Drug Discovery Simualtor`}</title>
        </Head>
        <SettingsProvider>
          <SettingsConsumer>
            {({ settings }) => {
              return <ThemeComponent settings={settings}>{getLayout(<Component {...pageProps} />)}</ThemeComponent>
            }}
          </SettingsConsumer>
        </SettingsProvider>
      </CacheProvider>
      <NotificationContainer />
    </>
  )
}

export default App
