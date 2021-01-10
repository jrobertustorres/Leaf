import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { TranslateConfigService } from '../services/translate-config.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { Device } from '@ionic-native/device/ngx';
import { AppRate } from '@ionic-native/app-rate/ngx';

import { EventService } from '../../utilitarios/EventService';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  private selectedLanguage: string;
  private accessi18nData: any;
  // version: Promise<string>;
  version: string;
  // text: string = this.accessi18nData['TITLE_SOCIAL_SHARING'];
  imgurl:string = 'https://cdn.pixabay.com/photo/2019/12/26/05/10/pink-4719682_960_720.jpg';
  link: string = 'https://play.google.com/store/apps/details?id=com.logiicstudio.leaf';

  constructor(private translateConfigService: TranslateConfigService,
              private appVersion: AppVersion,
              private emailComposer: EmailComposer,
              private device: Device,
              private appRate: AppRate,
              public platform: Platform,
              private eventService: EventService,
              private socialSharing: SocialSharing) {
    this.selectedLanguage = this.translateConfigService.getDefaultLanguage();
  }

  ngOnInit() {
    if (this.platform.is('cordova')) {
    this.appVersion.getVersionNumber().then((version) => {
      this.version = version;
    })
  }
  }

  languageChanged(){
    this.translateConfigService.setLanguage(this.selectedLanguage);
    
    this.eventService.publishChangeLanguage({
      selectedLanguage: this.selectedLanguage
    });
  }

  changeBackgroundHome() {
    
  }

  shareGeneric(parameter){
    const url = this.link;
    // const text = parameter+'\n';
    this.socialSharing.share(this.accessi18nData['TITLE_SOCIAL_SHARING'], 'MEDIUM', null, url);
    // this.socialSharing.share(text, 'MEDIUM', null, url);
  }

  sendEmailFeedback() {
    this.emailComposer.isAvailable().then((available: boolean) =>{
      if(available) {
      }
     });
     
     let email = {
       to: 'diretoria@logiic.com.br',
       cco: ['jose@logiic.com.br', 'bruno@logiic.com.br'],
       subject: 'Leaf - Sons para dormir Feedback',
       body: '<h1>'+ 'Informações do sistema' +'</h1>'+
       '<h1>App v'+ this.version +'</h1>' +
       '<h1>'+ this.device.model +'</h1>' +
       '<h1>'+ this.device.platform +' '+ this.device.version +'</h1>' +
       '<h1>----------------------</h1>',
       isHtml: true
     };

     this.emailComposer.open(email);
  }

  rateApp() {
    // set certain preferences
    this.appRate.preferences.storeAppURL = {
      ios: '<app_id>',
      android: 'market://details?id=<package_name>',
      windows: 'ms-windows-store://review/?ProductId=<store_id>'
    }

    this.appRate.promptForRating(true);

    // or, override the whole preferences object
    this.appRate.preferences = {
      usesUntilPrompt: 3,
      storeAppURL: {
      ios: '<app_id>',
      android: 'market://details?id=<package_name>',
      windows: 'ms-windows-store://review/?ProductId=<store_id>'
      }
    }

    this.appRate.promptForRating(false);
  }

}
