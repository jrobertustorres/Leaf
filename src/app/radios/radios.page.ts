import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, LoadingController } from "@ionic/angular";
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig, AdMobFreeRewardVideoConfig } from '@ionic-native/admob-free/ngx';
import { MusicPlayerService } from '../services/music-player.service';
import { NowPlayingPage } from '../now-playing/now-playing.page';
import { EventService } from '../../utilitarios/EventService';

@Component({
  selector: 'app-radios',
  templateUrl: './radios.page.html',
  styleUrls: ['./radios.page.scss'],
})
export class RadiosPage implements OnInit {
  jsonPathRadios: Array<string> = [];
  private _scrollDepthTriggered = false;
  slice: number = 8;

  constructor(private musicService: MusicPlayerService,
              public modalCtrl: ModalController,
              private eventService: EventService,
              private admobFree: AdMobFree,
              public loadingController: LoadingController,
              public alertController: AlertController) { }

  ngOnInit() {
    this.getRadiosJsonFile();
  }

  ionViewWillEnter() {
    this.interstitial();
  }

  //FUNCTION FOR INTERSTITIAL
  interstitial(){
    let interstitialConfig: AdMobFreeInterstitialConfig = {
      isTesting: true,
      autoShow: true
      // id: "ca-app-pub-1449609669530104/3079724176"
    };
      this.admobFree.interstitial.config(interstitialConfig);
      this.admobFree.interstitial.prepare().then(() => {
    }).catch(e => console.log(e));
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
     this.slice += 8;
     infiniteScroll.target.complete();
    }, 300);
  }

  getRadiosJsonFile() {
    try {
      this.loadingJsonRadios();
      this.musicService.getJsonRadioFile()
      .then((radiosData: any) => {
        this.jsonPathRadios = radiosData;
        localStorage.setItem('PATH_RADIOS', JSON.stringify(this.jsonPathRadios));
      }, (err) => {
        if(err) {
          this.radiosAlert();
        }
      });

    }catch (err){
      if(err instanceof RangeError){
      }
    }
  }

  async radiosAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alert',
      message: "Couldn't get radios",
      buttons: [{
        text: 'Ok',
          handler: () => {
            navigator['app'].exitApp();
          }
        }]
    });

    await alert.present();
  }

  async openMusicPlayer(nameRadio: string, categoria: string) {

    // chamando aqui o publish event informando que é para fechar o modal antes de abrir novamente. 
    // Se não, ficam várias instancias abertas (vários modais).
    // pego esse evento lá na página do modal
    this.eventService.publishCloseModal({
      buttonClicked: true
    });
    
    const modal = await this.modalCtrl.create({
      component: NowPlayingPage,
      cssClass: 'my-custom-modal-css',
      componentProps: { nameRadio: nameRadio, categoriaRadio: categoria }
    });
    return await modal.present();
  
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
    const targetPercent = 10;
    // const targetPercent = 20;
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

  async loadingJsonRadios() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Loading...',
      spinner: 'dots',
      duration: 500
    });
    await loading.present();

    if(this.jsonPathRadios) {
      await loading.onDidDismiss();
    }
  }

}
