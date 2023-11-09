import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config){
      on('before:browser:launch', (browser ={}, launchOptions)=>{
        launchOptions.extensions.push('./extension')
      return launchOptions
      })
    },
    baseUrl: 'http://localhost:5173',
    env: {
      apiUrl:'https://lm-dev.koneksys.com'
    },
    setupNodeEvents() {
      // implement node event listeners here
    },
  },
  defaultCommandTimeout: 8000, 
  pageLoadTimeout:10000,
  experimentalSessionAndOrigin: true,
  chromeWebSecurity: false,
  screenshotOnRunFailure: false,

  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },
});