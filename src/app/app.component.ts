import { Component } from '@angular/core';

import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateConfigService } from '../app/services/translate-config.service';
import { Network } from '@ionic-native/network/ngx';
import { AdmobService } from '../app/services/admob.service';

// import { FCM } from "cordova-plugin-fcm-with-dependecy-updated/ionic/ngx";

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
    private admobService: AdmobService,
    // private fcm: FCM,
    public alertController: AlertController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.splashScreen.show();
      //LOAD THE BANNER AT PAGE INIT
      this.admobService.ShowBanner();
      this.checkNetwork();
      //OBTENDO O IDIOMA CONFIGURADO NO APARELHO
      this.translateConfigService.getDefaultLanguage();
      
      // set status bar to white
      // this.statusBar.backgroundColorByHexString('#ffffff');
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      // get FCM token
      // this.fcm.getToken().then(token => {
      //   console.log(token);
      // });

      // ionic push notification example
      // this.fcm.onNotification().subscribe(data => {
      //   console.log(data);
      //   if (data.wasTapped) {
      //     console.log('Received in background');
      //   } else {
      //     console.log('Received in foreground');
      //   }
      // });      

      // // refresh the FCM token
      // this.fcm.onTokenRefresh().subscribe(token => {
      //   console.log(token);
      // });

      // unsubscribe from a topic
      // this.fcm.unsubscribeFromTopic('offers');

    });
  }

  // subscribeToTopic() {
  //   this.fcm.subscribeToTopic('enappd');
  // }
  // getToken() {
  //   this.fcm.getToken().then(token => {
  //     console.log('dentro do getToken ');
  //     console.log(token);
  //     // Register your new token in your back-end if you want
  //     // backend.registerToken(token);
  //   });
  // }
  // unsubscribeFromTopic() {
  //   this.fcm.unsubscribeFromTopic('enappd');
  // }

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

}
