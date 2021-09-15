import { Component } from '@angular/core';

import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateConfigService } from '../app/services/translate-config.service';
import { Network } from '@ionic-native/network/ngx';

import { FCM } from "cordova-plugin-fcm-with-dependecy-updated/ionic/ngx";
// import { FCM } from '@ionic-native/fcm/ngx';
import { AdMobFree, AdMobFreeBannerConfig,AdMobFreeInterstitialConfig,AdMobFreeRewardVideoConfig } from '@ionic-native/admob-free/ngx';
import { AppRate } from '@ionic-native/app-rate/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  showSplash = true;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translateConfigService: TranslateConfigService,
    private network: Network,
    private admobFree: AdMobFree,
    private fcm: FCM,
    private appRate: AppRate,
    public alertController: AlertController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.splashScreen.show();
      // setTimeout(() => {
        this.banner();
        // this.splashScreen.hide();
      // }, 1000);

      //LOAD THE BANNER AT PAGE INIT
      // this.admobService.ShowBanner();
      this.checkNetwork();
      this.rateUs();
      //OBTENDO O IDIOMA CONFIGURADO NO APARELHO
      this.translateConfigService.getDefaultLanguage();
      // if (this.platform.is('cordova')) {
        // this.banner();
      // }
      
      this.statusBar.styleDefault();
      // this.splashScreen.hide();
      if (this.platform.is('cordova')) {
        this.pushSetup();
      }


    });
  }

  banner(){
    let bannerConfig: AdMobFreeBannerConfig = {
      isTesting: true,
      autoShow: true,
      // id: "ca-app-pub-1449609669530104/7972958203"
    };
    this.admobFree.banner.config(bannerConfig);

    this.admobFree.banner.prepare().then(() => {
        // success
        this.admobFree.banner.show().then(()=>{
          this.splashScreen.hide();
       });
    }).catch(e => console.log(e));

  }

  checkNetwork() {
    setTimeout(() => {
      if (this.network.type === 'none') {
        this.presentAlert();
      }
    }, 1000);
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      // header: 'Alert',
      subHeader: 'Conection',
      message: 'No internet conection',
      buttons: [{
        text: 'Ok',
        handler: () => {
          navigator['app'].exitApp();
        }
        }]
    });

    await alert.present();
  }

  pushSetup() {
    // get FCM token
    this.fcm.getToken().then(token => {
      console.log(token);
    });

    // ionic push notification example
    this.fcm.onNotification().subscribe(data => {
      console.log(data);
      if (data.wasTapped) {
        console.log('Received in background');
      } else {
        console.log('Received in foreground');
      }
    });      

    // refresh the FCM token
    this.fcm.onTokenRefresh().subscribe(token => {
      console.log(token);
    });

    // unsubscribe from a topic
    // this.fcm.unsubscribeFromTopic('offers');
  }

  rateUs(){
    // this.appRate.preferences.storeAppURL = {
    //   //ios: '< my_app_id >',
    //   android: 'market://details?id=com.logiicstudio.leaf'
    //   };

    this.appRate.setPreferences({
      displayAppName: 'Leaf',
      usesUntilPrompt: 3,
      promptAgainForEachNewVersion: false,
      storeAppURL: {
        ios: '<my_app_id>',
        android: 'market://details?id=com.logiicstudio.leaf',
      },
    });
    
    this.appRate.promptForRating(false);

  }

}
