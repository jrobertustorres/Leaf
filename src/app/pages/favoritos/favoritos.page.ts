import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { DatePipe } from '@angular/common';

import { EventService } from '../../../utilitarios/EventService';
import { NowPlayingPage } from '../../now-playing/now-playing.page';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage implements OnInit {
  private _scrollDepthTriggered = false;
  maxDateNovo: string;
  slice: number = 8;
  private _updateList: boolean = false;
  public favoritosList: Object[] = [];

  constructor(private eventService: EventService,
              public datepipe: DatePipe,
              public loadingController: LoadingController,
              public modalCtrl: ModalController) { 

    this.eventService.updateFavoritosList().subscribe((data) => {
      this._updateList = data;
      this.getFavoritosList();
    });
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getFavoritosList();
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
     this.slice += 8;
     infiniteScroll.target.complete();
    }, 300);
   }
  
  getFavoritosList() {
    if(!this._updateList) {
      this.loadingFavoritos();
    }
    this.favoritosList = JSON.parse(localStorage.getItem('FAVORITOS_LIST'));
  }

  // criar um service para essa função
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

  async loadingFavoritos() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Loading...',
      spinner: 'dots',
      duration: 500
    });
    await loading.present();

    if(this.favoritosList) {
      await loading.onDidDismiss();
    }
  }

}
