import { Component } from '@angular/core';
import { Platform, ActionSheetController } from '@ionic/angular';
import { TranslateConfigService } from '../services/translate-config.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { Device } from '@ionic-native/device/ngx';
import { HttpClient } from '@angular/common/http';

import { Market } from '@ionic-native/market/ngx';
import { AppRate } from '@ionic-native/app-rate/ngx';

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
  imgurl: string = 'https://repositoriocalm.s3.amazonaws.com/gifs/logo.jpg';
  link: string = 'https://play.google.com/store/apps/details?id=com.logiicstudio.leaf';

  constructor(private translateConfigService: TranslateConfigService,
              private appVersion: AppVersion,
              private emailComposer: EmailComposer,
              private device: Device,
              public platform: Platform,
              private eventService: EventService,
              private http: HttpClient,
              private market: Market,
              private appRate: AppRate,
              public actionSheetController: ActionSheetController,
              private socialSharing: SocialSharing) {
    this.selectedLanguage = this.translateConfigService.getDefaultLanguage();
    this.accessi18nData = JSON.parse(localStorage.getItem('I18N_DICTIONARY'));
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

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: this.accessi18nData['COMPARTILHAR'],
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Facebook',
        icon: 'logo-facebook',
        handler: () => {
          this.shareviaFacebook();
        }
      }, {
        text: 'Whatsapp',
        icon: 'logo-whatsapp',
        handler: () => {
          this.shareviaWhatsapp();
        }
      }, {
        text: this.accessi18nData['HOME']['BTN_CANCELAR'],
        icon: 'close',
        role: 'cancel',
        handler: () => {
        }
      }]
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
  }

  shareviaFacebook() {
    this.socialSharing.shareViaFacebook(this.accessi18nData['TITLE_SOCIAL_SHARING'],this.imgurl, this.link)
    .then((success) =>{
      })
      .catch((err)=>{
      });
  }

  shareviaWhatsapp() {
    this.socialSharing.shareViaWhatsApp(this.accessi18nData['TITLE_SOCIAL_SHARING'],this.imgurl, this.link)
      .then((success) =>{
       })
        .catch(()=>{
        });
  }

  shareviaInstagram() {
    this.socialSharing.shareViaInstagram(this.accessi18nData['TITLE_SOCIAL_SHARING'],this.imgurl)
    .then((success) =>{
      })
      .catch(()=>{
      });
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

  async rateUs() {
    this.market.open('com.logiicstudio.leaf');
  }

  privacy() {
    window.open('https://sites.google.com/view/leaf-calm-your-mind/', '_system');
  }


}
