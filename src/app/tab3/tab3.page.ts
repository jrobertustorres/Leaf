import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { TranslateConfigService } from '../services/translate-config.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { Device } from '@ionic-native/device/ngx';
import { AppRate } from '@ionic-native/app-rate/ngx';
import { HttpClient } from '@angular/common/http';

import { EventService } from '../../utilitarios/EventService';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  public selectedLanguage: string;
  private accessi18nData: any;
  version: string;
  imgurl:string = 'https://www.dropbox.com/s/i7zm5nu1r7lwvlr/logo.png?dl=0';
  link: string = 'https://play.google.com/store/apps/details?id=com.logiicstudio.leaf';

  constructor(private translateConfigService: TranslateConfigService,
              private appVersion: AppVersion,
              private emailComposer: EmailComposer,
              private device: Device,
              private appRate: AppRate,
              public platform: Platform,
              private eventService: EventService,
              private httpC: HttpClient,
              private socialSharing: SocialSharing) {
    this.selectedLanguage = this.translateConfigService.getDefaultLanguage();

    this.httpC.get('assets/i18n/'+this.selectedLanguage+'.json').subscribe(data => {
      this.accessi18nData = data;
    });
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
    // const url = this.link;
    this.socialSharing.share(this.accessi18nData['TITLE_SOCIAL_SHARING'], 'MEDIUM', null, this.link);
  }

  sendEmailFeedback() {
    this.emailComposer.isAvailable().then((available: boolean) =>{
      if(available) {
      }
     });
     
     let email = {
       to: 'logiicstudio@gmail.com',
       bcc: ['jrobertustorres@gmail.com', 'brunokmargus@gmail.com'],
       subject: this.accessi18nData['SUBJECT_LEAF'],
       body: '<h1>'+ this.accessi18nData['TITLE_INFO_SISTEMA'] +'</h1>'+
       '<h1>App v'+ this.version +'</h1>' +
       '<h1>'+ this.device.model +'</h1>' +
       '<h1>'+ this.device.platform +' '+ this.device.version +'</h1>' +
       '<h1>----------------------</h1>',
       isHtml: true
     };

     this.emailComposer.open(email);
  }

  rateUs() {
    window.open('https://play.google.com/store/apps/details?id=com.logiicstudio.leaf', '_system', 'location=yes');
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
