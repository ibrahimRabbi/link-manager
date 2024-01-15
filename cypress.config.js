import { defineConfig } from 'cypress';


export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    testIsolation: false,
    defaultCommandTimeout: 15000,
    env: {
      "MAILOSAUR_API_KEY": "nyh1ZJY65yBhYqMM5bcLplKp0lq3HeEx"
    }
  },
  
});



// export default defineConfig({
//   e2e: {
//     setupNodeEvents(on, config) {
//       on('before:browser:launch', (browser = {}, launchOptions) => {
//         launchOptions.extensions.push('./extension');
//         return launchOptions;
//       });
//     },
//     baseUrl: 'http://localhost:5173',
//     testIsolation: false,
    
//   },
//   //retries:2,
//   defaultCommandTimeout: 15000,
//   pageLoadTimeout: 10000,
//   experimentalSessionAndOrigin: true,
//   chromeWebSecurity: false,
//   screenshotOnRunFailure: false,
//   video: false,
//   component: {
//     devServer: {
//       framework: 'react',
//       bundler: 'vite',
//     },
//   },
// });