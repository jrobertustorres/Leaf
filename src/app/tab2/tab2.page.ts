import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { EventService } from '../../utilitarios/EventService';
import { NowPlayingPage } from '../now-playing/now-playing.page';
// import { AdmobService } from '../services/admob.service';
import { AdMobFree, AdMobFreeBannerConfig,AdMobFreeInterstitialConfig,AdMobFreeRewardVideoConfig } from '@ionic-native/admob-free/ngx';


import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  segmentModel = "all";
  @Input() soundValue: string;// pega o parâmetro passado

  constructor(private eventService: EventService,
              // private admobService: AdmobService,
              private activatedRoute: ActivatedRoute,
              private admobFree: AdMobFree,
              private iab: InAppBrowser,
              public modalCtrl: ModalController) {
                this.segmentModel = this.activatedRoute.snapshot.paramMap.get('segmentModel') ? 
                this.activatedRoute.snapshot.paramMap.get('segmentModel') : "all";
              }

  ngOnInit() {
  }
  
  ionViewWillEnter() {
    this.interstitial();
  }

  //FUNCTION FOR INTERSTITIAL
  interstitial(){
    let interstitialConfig: AdMobFreeInterstitialConfig = {
      isTesting: true, // Remove in production
      autoShow: true//,
      //id: "ca-app-pub-3940256099942544/6300978111"
    };
      this.admobFree.interstitial.config(interstitialConfig);
      this.admobFree.interstitial.prepare().then(() => {
    }).catch(e => console.log(e));
  }
  
  async openMusicPlayer(som: string, id: number) {

    // chamando aqui o publish event informando que é para fechar o modal antes de abrir novamente.
    // pego esse evento lá na página do modal
    this.eventService.publishCloseModal({
      buttonClicked: true
    });
    
    const modal = await this.modalCtrl.create({
      component: NowPlayingPage,
      cssClass: 'my-custom-modal-css',
      componentProps: { soundValue: som, idSound: id }
    });
    return await modal.present();
  }

}
