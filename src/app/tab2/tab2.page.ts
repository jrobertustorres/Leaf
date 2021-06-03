import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { EventService } from '../../utilitarios/EventService';
import { NowPlayingPage } from '../now-playing/now-playing.page';
import { LoadingController } from '@ionic/angular';
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig, AdMobFreeRewardVideoConfig } from '@ionic-native/admob-free/ngx';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  segmentModel = "ALL";
  @Input() soundValue: string;// pega o parâmetro passado

  objectSound: Array<string> = [];
  objectSegmentSound: Array<string> = [];
  uniqueObjectLabelSound: Array<string>;
  slice: number = 8;

  maxDateNovo: any;

  constructor(private eventService: EventService,
              private activatedRoute: ActivatedRoute,
              private admobFree: AdMobFree,
              private iab: InAppBrowser,
              public loadingController: LoadingController,
              private navCtrl: NavController,
              public httpClient: HttpClient,
              public datepipe: DatePipe,
              public modalCtrl: ModalController) {
                this.segmentModel = this.activatedRoute.snapshot.paramMap.get('segmentModel') ? 
                this.activatedRoute.snapshot.paramMap.get('segmentModel') : "ALL";
                this.segmentModel = this.segmentModel.toUpperCase();
                // this.accessi18nData = JSON.parse(localStorage.getItem('I18N_DICTIONARY'));
                // this.home = this.accessi18nData['HOME'];

              }

  ngOnInit() {
    this.verificaNovo();
    this.loadingImages();
  }

  ionViewWillEnter() {
    this.getAllImages();
    this.interstitial();
  }

  ionViewDidEnter() {
    // this.setFocusSegment(this.segmentModel);
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
     this.slice += 8;
     infiniteScroll.target.complete();
    }, 300);
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

  getAllImages() {
    this.objectSound = JSON.parse(localStorage.getItem('PATH_SOUND'));
    // let objectAux = this.objectSound;

      // if (objectAux[i]['categoria'] == ""){
      //   objectAux.slice();
      //   this.objectSound = objectAux;
      //   console.log(this.objectSound);
      // }
    // }

    let updatedArray = [];
    for(let i = 0; i < this.objectSound.length; i++) {
      if (this.objectSound[i]['categoria'] != ""){
        updatedArray.push(this.objectSound[i]);
        if(this.objectSound[i]['maxDateNovo'] >= this.maxDateNovo) {
          this.objectSound[i]['novo'] = true;
        }
      }
    }
    this.objectSound = updatedArray;

    this.removeSegmentDuplicates();
  }

  getSegmentByCategory(categoria: string) {
    this.objectSegmentSound = [];
    for(let i = 0; i < this.objectSound.length; i++) {
      if (categoria === this.objectSound[i]['categoria']){
        this.objectSegmentSound.push(this.objectSound[i]);
      }
    }
  }

  verificaNovo() {
    this.maxDateNovo = new Date().toISOString();
    this.maxDateNovo = this.datepipe.transform(this.maxDateNovo, 'yyyy-MM-dd');
  }

  setFocusSegment(categoria: string) {
    document.getElementById(categoria).scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center'
    });
  }

  removeSegmentDuplicates() {
    let unique_array = [];
    let aux: string = '';
    for(let i = 0;i < this.objectSound.length; i++){
      if (aux != this.objectSound[i]['labelCategoria']){
        aux = this.objectSound[i]['labelCategoria'];
        unique_array.push(this.objectSound[i]);
      }
      this.uniqueObjectLabelSound = unique_array;
    }
    this.getSegmentByCategory(this.segmentModel);
  }

  // async slideChanged() {
  //   this.activeIndex= await this.slider.getActiveIndex();
  //     document.getElementById("segment-" + activeIndex).scrollIntoView({
  //     behavior: 'smooth',
  //     block: 'center',
  //     inline: 'center'
  //   });
  // }
  
  async openMusicPlayer(som: string) {

    // chamando aqui o publish event informando que é para fechar o modal antes de abrir novamente. 
    // Se não, ficam várias instancias abertas (vários modais).
    // pego esse evento lá na página do modal
    this.eventService.publishCloseModal({
      buttonClicked: true
    });
    
    const modal = await this.modalCtrl.create({
      component: NowPlayingPage,
      cssClass: 'my-custom-modal-css',
      componentProps: { soundValue: som }
    });
    return await modal.present();
  
  }
  

}
