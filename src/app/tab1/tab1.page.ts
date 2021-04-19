import { Component } from '@angular/core';
import { NavController, AlertController, ModalController } from "@ionic/angular";
import { Router } from '@angular/router';
import { Howl } from 'howler';
import { LoadingController } from '@ionic/angular';

import { TranslateConfigService } from '../services/translate-config.service';
import { HttpClient } from '@angular/common/http';
import { EventService } from '../../utilitarios/EventService';
import { MusicPlayerService } from '../services/music-player.service';

import { BreathPage } from '../breath/breath.page';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  player: Howl = null;
  play: boolean;
  labelButton: string = '';
  // agora: number;
  // mesAtual: string;
  backgroundImage: string = '';
  // dia: boolean = true;
  saudacao: string = '';
  homeSound: any;
  pathSound: Object = [];

  selectedLanguage: string;
  private accessi18nData: any;

  arrayFrase: string;
  fraseHoje: string;
  autorHoje: string;
  private scrollDepthTriggered = false;

  // home = {};
  home: any;

  constructor(private translateConfigService: TranslateConfigService,
              private http: HttpClient,
              // private admobService: AdmobService,
              // private admobFree: AdMobFree,
              private musicService: MusicPlayerService,
              private navCtrl: NavController,
              private router: Router,
              public alertController: AlertController,
              public modalCtrl: ModalController,
              public loadingController: LoadingController,
              private eventService: EventService) {
    this.selectedLanguage = this.translateConfigService.getDefaultLanguage();

    this.getLanguageDictionary();

    // this.http.get('https://repositoriocalm.s3.amazonaws.com/i18n/'+this.selectedLanguage+'.json').subscribe(data => {
    // // this.httpC.get('assets/i18n/'+this.selectedLanguage+'.json').subscribe(data => {
    //   this.accessi18nData = data;
    //   localStorage.setItem('I18N_DICTIONARY', JSON.stringify(this.accessi18nData));
    //   this.home = this.accessi18nData['HOME'];
    // });

    this.getChangeLanguage();
  }

  ngOnInit() {
    // this.Interstitial();
    // this.banner();
    // this.verificaStatusPlayer();

    // interval(10 * 60).subscribe(x => {
    //   // this.getTime();
    //   // this.getDate();
    // this.musicService.getJsonFile();
    this.changeBackground();      
    // });

    // localStorage.removeItem('DIA_DA_SEMANA');
    // localStorage.removeItem('FRASE_HOJE');

    // frase da home
    // if((new Date()).getDay().toString() != localStorage.getItem('DIA_DA_SEMANA')) {
    //   this.frases();
    // } else {
    //   this.arrayFrase = localStorage.getItem('ARRAY_HOJE');
    //   this.fraseHoje = JSON.parse(this.arrayFrase)[0]['FRASE'];
    //   this.autorHoje = JSON.parse(this.arrayFrase)[0]['AUTOR'];
    // }

  }

  ionViewWillEnter() {
    // this.verificaStatusPlayer();
  }

  ionViewWillLeave() {
    this.labelButton = this.accessi18nData['HOME']['BTN_LIGAR'];
    if(this.player) {
      this.player.stop();
      this.player.unload();
    }
  }

  getLanguageDictionary() {
    try {
      this.loadingDictionary();

      this.translateConfigService.getI18nData(this.selectedLanguage)
      .then((data) => {
        this.accessi18nData = data;
        localStorage.setItem('I18N_DICTIONARY', JSON.stringify(this.accessi18nData));
        this.home = this.accessi18nData['HOME'];
        this.getSoundPathJsonFile();
      }, (err) => {
        if (err) {
          this.dictionaryAlert();
        }
      });

    }catch (err){
      if(err instanceof RangeError){
      }
      console.log(err);
    }
  }

  getSoundPathJsonFile() {
    try {
      // this.loadingDictionary();

      this.musicService.getJsonFile()
      .then((soundData) => {
        this.pathSound = soundData;
        localStorage.setItem('PATH_SOUND', JSON.stringify(this.pathSound));
        this.verificaStatusPlayer();
      }, (err) => {
        if(err) {
          this.soundsAlert();
        }
      });

    }catch (err){
      if(err instanceof RangeError){
      }
      console.log(err);
    }
  }

  getChangeLanguage() {
    this.eventService.getObservableChangeLanguage().subscribe((data) => {
      this.selectedLanguage = data.selectedLanguage;
      this.getLanguageDictionary();
    });
  }

  async soundsAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alert',
      message: "Couldn't get sound files",
      buttons: [{
        text: 'Ok',
          handler: () => {
            navigator['app'].exitApp();
          }
        }]
    });

    await alert.present();
  }

  async dictionaryAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alert',
      message: "Couldn't get language dictionary",
      buttons: [{
      text: 'Ok',
        handler: () => {
          navigator['app'].exitApp();
        }
      }]
    });

    await alert.present();
  }
  
  async loadingDictionary() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Loading...',
      spinner: 'dots',
      duration: 500
    });
    await loading.present();

    if(this.accessi18nData && this.pathSound) {
      await loading.onDidDismiss();
    }
  }

  // fraseDoDia() {
  //   // seleciona a frase do dia
  //   let arrayHoje = localStorage.getItem('ARRAY_HOJE');
    
  //   for(let i in this.accessi18nData['FRASES']){
  //     if(JSON.parse(arrayHoje)[0]['ID'] == this.accessi18nData['FRASES'][i]['ID']) {
  //       let frase = [this.accessi18nData['FRASES'][i]];
  //       this.fraseHoje = this.accessi18nData['FRASES'][i]['FRASE'];
  //       this.autorHoje = this.accessi18nData['FRASES'][i]['AUTOR'];
  //       localStorage.setItem('ARRAY_HOJE', JSON.stringify(frase));
  //     }
  //   }
  // }

  verificaStatusPlayer() {
    this.play = JSON.parse(localStorage.getItem('STATUS_PLAYER'));
    if(localStorage.getItem('STATUS_PLAYER') == null || localStorage.getItem('STATUS_PLAYER') == 'true') {
      this.startHomeSound();
    } else {
      this.labelButton = this.accessi18nData['HOME']['BTN_LIGAR'];
    }
  }

  startHomeSound() {
    this.labelButton = this.accessi18nData['HOME']['BTN_LIGAR'];
    if(this.player) {
      this.player.stop();
      this.player.unload();
    }

    this.player = new Howl({
      src: [this.homeSound],
      html5: true,
      loop: true,
      onload: () => {
      },
      onplay: () => {
        this.play = true;
        localStorage.setItem('STATUS_PLAYER', 'true');
        this.labelButton = this.accessi18nData['HOME']['BTN_DESLIGAR'];
      },
      onend: () => {
      }
    });
    this.player.play();
  }

  stopHomeSound() {
    this.labelButton = this.accessi18nData['HOME']['BTN_LIGAR'];
    localStorage.setItem('STATUS_PLAYER', 'false');
    if(this.player) {
      this.player.stop();
      this.player.unload();
    }
  }

  async setStateSound() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: this.accessi18nData['HOME']['LABEL_SON_HOME'],
      message: this.accessi18nData['HOME']['MSG_ALERT'],
      buttons: [
        {
          text: this.accessi18nData['HOME']['BTN_CANCELAR'],
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: this.labelButton,
          handler: () => {
            this.play = !this.play;
            localStorage.setItem('STATUS_PLAYER', this.play.toString());
            if(!this.play) {
              this.stopHomeSound();
            } else {
              this.startHomeSound();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async logScrolling($event) {

    if($event.target.localName != "ion-content") {
      return;
    }

    const scrollElement = await $event.target.getScrollElement();
    // minus clientHeight because trigger is scrollTop
    // otherwise you hit the bottom of the page before 
    // the top screen can get to 80% total document height
    const scrollHeight = scrollElement.scrollHeight - scrollElement.clientHeight;
    const currentScrollDepth = $event.detail.scrollTop;
    // this.yourToggleFlag = currentScrollDepth < 413 ? true : false; 
    const targetPercent = 20;
    let triggerDepth = ((scrollHeight / 100) * targetPercent);
    if(currentScrollDepth > triggerDepth) {
      // this ensures that the event only triggers once
      this.scrollDepthTriggered = true;
    }
    if(currentScrollDepth < triggerDepth) {
      // this ensures that the event only triggers once
      this.scrollDepthTriggered = false;
    }
  }

  //FUNCTION FOR INTERSTITIAL
  // Interstitial(){
  //   this.admobService.ShowInterstitial();
  // }
  // banner(){
  //   // this.admobService.ShowBanner();
  //   let bannerConfig: AdMobFreeBannerConfig = {
  //     isTesting: true, // Remove in production
  //     autoShow: true//,
  //     //id: "ca-app-pub-3940256099942544/6300978111"
  //   };
  //   this.admobFree.banner.config(bannerConfig);

  //   this.admobFree.banner.prepare().then(() => {
  //       // success
  //   }).catch(e => alert(e));
  // }
  // FUNCTION FOR VIDEOREWARD
  // Reward(){
  //   this.admobService.ShowRewardVideo();
  // }

  

  // frases() {

  //   this.httpC.get('assets/i18n/'+this.selectedLanguage+'.json').subscribe(data => {
  //     this.accessi18nData = data;

  //     let rd = Math.floor(Math.random() * this.accessi18nData['FRASES'].length);
  //     let frase = [this.accessi18nData['FRASES'][rd]];

  //     this.fraseHoje = frase[0]['FRASE'];
  //     this.autorHoje = frase[0]['AUTOR'];
  //     localStorage.setItem('ARRAY_HOJE', JSON.stringify(frase));
  //     localStorage.setItem('DIA_DA_SEMANA', (new Date()).getDay().toString());
  //   });
    
  // }

  openMusic(segmentModel: any) {
    if(segmentModel == 'breath') {
      this.openBreath();
    } else {
      this.navCtrl.navigateRoot('/tabs/tab2/'+ segmentModel);
    }
  }

  openParaVocePage() {
    this.navCtrl.navigateRoot('/tabs/para-voce');
  }

  async openBreath() {

    const modal = await this.modalCtrl.create({
      component: BreathPage,
      cssClass: 'my-custom-modal-css',
      componentProps: {  }
    });
    return await modal.present();
  }

  // getTime() {
  //   this.agora = Date.now();
  // }
  
  // getDate() {
  //   let nomeMeses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];// colocar aqui para pegar a tradução
  //   this.mesAtual = nomeMeses[(new Date()).getMonth()];
  // }

  // melhorar aqui depois, pois se entrar aqui antes de carregar o som, não vai tocar nada.
  changeBackground() {
    // if(new Date().getHours() >= 6 && new Date().getHours() < 18) {
      this.homeSound = JSON.parse(localStorage.getItem('PATH_SOUND'));
    if(new Date().getHours() >= 6 && new Date().getHours() < 12) {
      this.backgroundImage = 'assets/imgs/home2.jpg'; // montanha
      this.homeSound = this.homeSound[2]['path']; //passaros1
      // this.backgroundImage = 'https://cdn.pixabay.com/photo/2016/09/19/07/01/lake-1679708_640.jpg'; // montanha
    } else if(new Date().getHours() >= 12 && new Date().getHours() < 18) {
      this.backgroundImage = 'assets/imgs/home2.jpg'; // montanha
      this.homeSound = this.homeSound[2]['path']; //passaros1
      // this.backgroundImage = 'https://cdn.pixabay.com/photo/2013/11/28/10/03/autumn-219972_960_720.jpg'; // lago
    } else {
      // this.backgroundImage = 'https://cdn.pixabay.com/photo/2019/06/07/13/11/landscape-4258253_960_720.jpg'; // desenho
      this.backgroundImage = 'assets/imgs/noite.gif'; // lua no lago
      this.homeSound = this.homeSound[12]['HOME']['CRICKETS']['path']; //crickets2
    }
  }

}
