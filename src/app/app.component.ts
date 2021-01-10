import { Component } from '@angular/core';

import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateConfigService } from '../app/services/translate-config.service';
import { Network } from '@ionic-native/network/ngx';

// import { timer } from 'rxjs';

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
    public alertController: AlertController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.splashScreen.show();
      this.checkNetwork();
      //OBTENDO O IDIOMA CONFIGURADO NO APARELHO
      this.translateConfigService.getDefaultLanguage();
      // this.translateConfigService.getI18nData();
      // let status bar overlay webview
      // this.statusBar.overlaysWebView(true);
      
      // set status bar to white
      // this.statusBar.backgroundColorByHexString('#ffffff');
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      // timer(300).subscribe(() => this.showSplash = false)
    });
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

}
