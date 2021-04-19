import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { EventService } from '../../utilitarios/EventService';
import { NowPlayingPage } from '../now-playing/now-playing.page';
// import { AdmobService } from '../services/admob.service';
import { LoadingController } from '@ionic/angular';
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig, AdMobFreeRewardVideoConfig } from '@ionic-native/admob-free/ngx';

import { ActivatedRoute } from '@angular/router';

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  segmentModel = "all";
  @Input() soundValue: string;// pega o parâmetro passado

  objectSound: Array<string>;
  uniqueObjectSound: Array<string>;

  constructor(private eventService: EventService,
              private activatedRoute: ActivatedRoute,
              private admobFree: AdMobFree,
              private iab: InAppBrowser,
              public loadingController: LoadingController,
              public httpClient: HttpClient,
              public modalCtrl: ModalController) {
                this.segmentModel = this.activatedRoute.snapshot.paramMap.get('segmentModel') ? 
                this.activatedRoute.snapshot.paramMap.get('segmentModel') : "all";
              }

  ngOnInit() {
    this.loadingImages();
  }
  
  ionViewWillEnter() {
    this.getImages();
    this.interstitial();
  }

  // async presentLoading() {
  //   const loading = await this.loadingController.create({
  //     cssClass: 'my-custom-class',
  //     message: 'Please wait...',
  //     duration: 2000
  //   });
  //   await loading.present();
  
  //   const { role, data } = await loading.onDidDismiss();
  // }

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

  async loadingImages() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Loading...',
      spinner: 'dots',
      duration: 500
    });
    await loading.present();

    if(this.objectSound) {
      await loading.onDidDismiss();
    }
  }

  getImages() {
    this.objectSound = JSON.parse(localStorage.getItem('PATH_SOUND'));
    this.removeDuplicates();
  }

  removeDuplicates() {

    let unique_array = [];
    let aux: string = '';
    for(let i = 0;i < this.objectSound.length; i++){
      if (aux != this.objectSound[i]['labelCategoria']){
        aux = this.objectSound[i]['labelCategoria'];
        unique_array.push(this.objectSound[i]);
      }
      this.uniqueObjectSound = unique_array;
    }
  }
  
  // async openMusicPlayer(som: string, id: number) {
  async openMusicPlayer(som: string) {

    // chamando aqui o publish event informando que é para fechar o modal antes de abrir novamente.
    // pego esse evento lá na página do modal
    this.eventService.publishCloseModal({
      buttonClicked: true
    });
    
    const modal = await this.modalCtrl.create({
      component: NowPlayingPage,
      cssClass: 'my-custom-modal-css',
      componentProps: { soundValue: som }
      // componentProps: { soundValue: som, idSound: id }
    });
    return await modal.present();
  }

}
