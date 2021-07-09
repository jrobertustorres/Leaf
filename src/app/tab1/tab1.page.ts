import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController, ModalController, IonContent } from "@ionic/angular";
import { Router } from '@angular/router';
import { Howl } from 'howler';
import { LoadingController } from '@ionic/angular';

import { DatePipe } from '@angular/common';

import { TranslateConfigService } from '../services/translate-config.service';
import { HttpClient } from '@angular/common/http';
import { EventService } from '../../utilitarios/EventService';
import { MusicPlayerService } from '../services/music-player.service';
import { BreathPage } from '../breath/breath.page';
import { NowPlayingPage } from '../now-playing/now-playing.page';

import { BackgroundMode } from '@ionic-native/background-mode/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  // @ViewChild(IonContent, undefined) content: IonContent;
  player: Howl = null;
  play: boolean;
  labelButton: string = '';
  backgroundImage: string = '';
  saudacao: string = '';
  homeSound: any;
  jsonPathSound: Array<string> = [];
  jsonPathSoundDestaque: Array<string> = [];

  selectedLanguage: string;
  private accessi18nData: any;
  labelDestaque: Array<string> = [];

  arrayFrase: string;
  fraseHoje: string;
  autorHoje: string;
  private _scrollDepthTriggered = false;
  maxDateNovo: any;
  home = {};

  constructor(private translateConfigService: TranslateConfigService,
              private http: HttpClient,
              private musicService: MusicPlayerService,
              private navCtrl: NavController,
              private router: Router,
              public alertController: AlertController,
              public modalCtrl: ModalController,
              public loadingController: LoadingController,
              public datepipe: DatePipe,
              private backgroundMode: BackgroundMode,
              private eventService: EventService) {
    this.backgroundMode.enable();
    this.selectedLanguage = this.translateConfigService.getDefaultLanguage();
    // this.getLanguageDictionary();
    this.getChangeLanguage();

    // this.eventService.getObservableCloseModal().subscribe((data) => {
    //   this.stopHomeSound();
    // });
  }

  ngOnInit() {
    this.changeBackground();   
    this.verificaNovo();

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
    this.getLanguageDictionary();
  }

  ionViewDidEnter(){
  }
  
  ionViewWillLeave() {
    // this.labelButton = this.accessi18nData['HOME']['BTN_LIGAR'];
    // if(this.player) {
    //   this.player.stop();
    //   this.player.unload();
    //   this.play = false;
    // }
  }

  checkHomeSound(pathSound) {
    this.homeSound = pathSound;
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
      this.musicService.getJsonFile()
      .then((soundData: any) => {
        this.jsonPathSound = soundData;
        localStorage.setItem('PATH_SOUND', JSON.stringify(this.jsonPathSound));
        this.jsonPathSoundDestaque  = [];
        
        for(let i = 0; i < this.jsonPathSound.length; i++) {
          // setar maxDateNovo somente no primeiro registro de cada album
          if((this.jsonPathSound[i]['maxDateNovo'] >= this.maxDateNovo)) {
            this.jsonPathSound[i]['labelDestaque'] = this.accessi18nData['HOME'][this.jsonPathSound[i]['labelDestaque']];
            this.jsonPathSoundDestaque.push(this.jsonPathSound[i]);
            this.jsonPathSound[i]['novo'] = true;
          } else if (this.jsonPathSound[i]['destaque']){
                    this.jsonPathSound[i]['labelDestaque'] = this.accessi18nData['HOME'][this.jsonPathSound[i]['labelDestaque']];
                    this.jsonPathSoundDestaque.push(this.jsonPathSound[i]);
          }
        }
        
        // for(let i = 0; i < this.jsonPathSound.length; i++) {
        //   if (this.jsonPathSound[i]['destaque']){
        //     this.jsonPathSound[i]['labelDestaque'] = this.accessi18nData['HOME'][this.jsonPathSound[i]['labelDestaque']];
        //     this.jsonPathSoundDestaque.push(this.jsonPathSound[i]);
        //     if(this.jsonPathSound[i]['maxDateNovo'] >= this.maxDateNovo) {
                // this.jsonPathSound[i]['novo'] = true;
        //     }
        //   }
        // }
        // this.setHomeSound();
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

  verificaNovo() {
    this.maxDateNovo = new Date().toISOString();
    this.maxDateNovo = this.datepipe.transform(this.maxDateNovo, 'yyyy-MM-dd');
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

    if(this.accessi18nData && this.jsonPathSound) {
      await loading.onDidDismiss();
    }
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
    const targetPercent = 5;
    // const targetPercent = 10;
    let triggerDepth = ((scrollHeight / 100) * targetPercent);
    if(currentScrollDepth > triggerDepth) {
      // this ensures that the event only triggers once
      this._scrollDepthTriggered = true;
    }
    if(currentScrollDepth < triggerDepth) {
      // this ensures that the event only triggers once
      this._scrollDepthTriggered = false;
    }
  }

  openMusic(soundValue: string, categoria: string, albumValue: string) {
    if(soundValue == 'para-voce') {
      this.openParaVocePage();
    } else 
      if(soundValue == 'breath') {
      this.openBreath();
    } else {
      this.openMusicPlayer(soundValue, categoria, albumValue);
      // this.navCtrl.navigateRoot('/tabs/tab2/'+ segmentModel);
    }
  }

  async openMusicPlayer(som: string, categoria: string, albumValue: string) {

    // chamando aqui o publish event informando que é para fechar o modal antes de abrir novamente. 
    // Se não, ficam várias instancias abertas (vários modais).
    // pego esse evento lá na página do modal
    this.eventService.publishCloseModal({
      buttonClicked: true
    });
    
    const modal = await this.modalCtrl.create({
      component: NowPlayingPage,
      cssClass: 'my-custom-modal-css',
      componentProps: { soundValue: som, categoria: categoria, albumValue: albumValue }
      // componentProps: { soundValue: som }
    });
    return await modal.present();
  }

  openParaVocePage() {
    this.navCtrl.navigateRoot('/para-voce');
  }

  async openBreath() {
    this.eventService.publishCloseModal({
      buttonClicked: true
    });

    const modal = await this.modalCtrl.create({
      component: BreathPage,
      cssClass: 'my-custom-modal-css',
      componentProps: {  }
    });
    return await modal.present();
  }

  // melhorar aqui depois, pois se entrar aqui antes de carregar o som, não vai tocar nada.
  changeBackground() {
    if(new Date().getHours() >= 6 && new Date().getHours() < 12) {
      this.backgroundImage = 'assets/imgs/home2.jpg'; // montanha com rio
    } else if(new Date().getHours() >= 12 && new Date().getHours() < 18) {
      this.backgroundImage = 'assets/imgs/home2.jpg'; // montanha com rio
    } else {
      this.backgroundImage = 'assets/imgs/noite.webp'; // lua no lago
    }
  }

  // verificaStatusPlayer() {
  //   this.play = JSON.parse(localStorage.getItem('STATUS_PLAYER'));
  //   if(localStorage.getItem('STATUS_PLAYER') == null || localStorage.getItem('STATUS_PLAYER') == 'true') {
  //     this.startHomeSound();
  //   } else {
  //     this.labelButton = this.accessi18nData['HOME']['BTN_LIGAR'];
  //   }
  // }

  // startHomeSound() {
  //   this.labelButton = this.accessi18nData['HOME']['BTN_LIGAR'];
  //   if(this.player) {
  //     this.player.stop();
  //     this.player.unload();
  //   }

  //   this.player = new Howl({
  //     src: [this.homeSound],
  //     html5: true,
  //     loop: true,
  //     onload: () => {
  //     },
  //     onplay: () => {
  //       this.play = true;
  //       localStorage.setItem('STATUS_PLAYER', 'true');
  //       this.labelButton = this.accessi18nData['HOME']['BTN_DESLIGAR'];
  //     },
  //     onend: () => {
  //     }
  //   });
  //   this.player.play();
  // }

  // stopHomeSound() {
  //   this.labelButton = this.accessi18nData['HOME']['BTN_LIGAR'];
  //   localStorage.setItem('STATUS_PLAYER', 'false');
  //   if(this.player) {
  //     this.play = false;
  //     this.player.stop();
  //     this.player.unload();
  //   }
  // }

  // async setSoundState() {
  //   const alert = await this.alertController.create({
  //     cssClass: 'my-custom-class',
  //     header: this.accessi18nData['HOME']['LABEL_SOM_HOME'],
  //     message: this.accessi18nData['HOME']['MSG_ALERT'],
  //     buttons: [
  //       {
  //         text: this.accessi18nData['HOME']['BTN_CANCELAR'],
  //         role: 'cancel',
  //         cssClass: 'secondary',
  //         handler: (blah) => {
  //         }
  //       }, {
  //         text: this.labelButton,
  //         handler: () => {
  //           this.play = !this.play;
  //           localStorage.setItem('STATUS_PLAYER', this.play.toString());
  //           if(!this.play) {
  //             this.stopHomeSound();
  //           } else {
  //             this.startHomeSound();
  //           }
  //         }
  //       }
  //     ]
  //   });

  //   await alert.present();
  // }

  // setHomeSound() {
  //   for(let i = 0; i < this.jsonPathSound.length; i++) {
  //     if (this.jsonPathSound[i]['useAtHome']){
  //       if(new Date().getHours() >= 6 && new Date().getHours() < 18) {
  //         this.homeSound = 'https://repositoriocalm.s3.amazonaws.com/mp3/passaros1.webm';
  //       } else {
  //         this.homeSound = 'https://repositoriocalm.s3.amazonaws.com/mp3/crickets2.webm';
  //       }
  //     }
  //   }

  //   this.verificaStatusPlayer();
  // }

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

  // getTime() {
  //   this.agora = Date.now();
  // }
  
  // getDate() {
  //   let nomeMeses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];// colocar aqui para pegar a tradução
  //   this.mesAtual = nomeMeses[(new Date()).getMonth()];
  // }

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

}
