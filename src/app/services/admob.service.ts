// import { Injectable } from '@angular/core';

// //IMPORT PLATFORM SO WE CAN START ADMOB AS SOON AS IT'S READY.
// import { Platform } from '@ionic/angular';
// //IMPORT WHAT WE NEED FROM ADMOBFREE PLUGIN.
// import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig, AdMobFreeRewardVideoConfig } from 
// '@ionic-native/admob-free/ngx';

// @Injectable({
//   providedIn: 'root'
// })
// export class AdmobService {

//   //BANNER CONFIG
//   bannerConfig: AdMobFreeBannerConfig = {
//     isTesting: true, // KEEP DURING CODING, REMOVE AT PROD.
//     autoShow: true//,
//     //id: "ID GENERATED AT ADMOB ca-app-pub FOR PROD"
//   };
//     //INTERSTITIAL CONFIG
//   interstitialConfig: AdMobFreeInterstitialConfig = {
//     isTesting: true, // KEEP DURING CODING, REMOVE AT PROD.
//     autoShow: true,
//     //id: "ID GENERATED AT ADMOB ca-app-pub FOR PROD"
//   };
//     //REWARD VIDEO CONFIG.
//   RewardVideoConfig: AdMobFreeRewardVideoConfig = {
//     isTesting: true, // KEEP DURING CODING, REMOVE AT PROD.
//     autoShow: false//,
//     //id: "ID GENERATED AT ADMOB ca-app-pub FOR PROD"
//   };

//   constructor(
//               public platform: Platform,
//               private admobFree: AdMobFree) {
//       //LOAD ADS AT PLATFORM READY PROMISE.
//       platform.ready().then(()=>{
//         //BANNER
//         this.admobFree.banner.config(this.bannerConfig);
//         //INTERSTITIAL
//         // this.admobFree.interstitial.config(this.interstitialConfig);
//         // this.admobFree.interstitial.prepare().then(() => {
//         //   console.log('INTERSTIAL LOADED')
//         // }).catch(e =>
//         //   console.log('PROBLEM LOADING INTERSTITIAL: ', e)
//         // );
//         //REWARD VIDEO
//         this.admobFree.rewardVideo.config(this.RewardVideoConfig);
//         this.admobFree.rewardVideo.prepare().then(() => {
//           console.log('REWARD VIDEO LOADED')
//         }).catch(e =>
//           console.log('PROBLEM LOADING REWARDVIDEO: ', e)
//         );
//       });
//     }

//     ShowBanner() {
//       //CHECK AND SHOW BANNER
//       this.admobFree.banner.prepare().then(() => {
//         console.log('BANNER LOADED')
//       }).catch(e =>
//         console.log('PROBLEM LOADING BANNER: ', e)
//       );
//     }
    
//     ShowInterstitial() {
//       //CHECK AND SHOW INTERSTITIAL
//       this.admobFree.interstitial.isReady().then(() => {
//       //AT .ISREADY SHOW 
//       this.admobFree.interstitial.show().then(() => {
//         console.log('INTERSTITIAL LOADED')
//       })
//       .catch(e => console.log('PROBLEM LOADING REWARD VIDEO: ', e)  );
//       })
//       .catch(e => console.log('PROBLEM LOADING REWARD VIDEO: ', e)  );
//     }
    
//     ShowRewardVideo() {
//       //CHECK AND SHOW REWARDVIDEO
//       this.admobFree.rewardVideo.isReady().then(() => {
//         //AT .ISREADY SHOW
//         this.admobFree.rewardVideo.show().then(() => {
//           console.log('BANNER LOADED')
//         })
//         .catch(e => console.log('PROBLEM LOADING REWARD VIDEO: ', e)  );
//       })
//       .catch(e => console.log('PROBLEM LOADING REWARD VIDEO: ', e)  );
//     }
// }
