import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController, ToastController } from '@ionic/angular';
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
  toastFavorito: string = '';
  private _accessi18nData: any;

  constructor(private eventService: EventService,
              public datepipe: DatePipe,
              public loadingController: LoadingController,
              public toastController: ToastController,
              public modalCtrl: ModalController) { 
    this._accessi18nData = JSON.parse(localStorage.getItem('I18N_DICTIONARY'));
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
  
  removeFavorito(soundValue: string){
    this.favoritosList.forEach((element,index)=>{
      if(element['soundValue'] == soundValue) this.favoritosList.splice(index,1);
   });
        
    if(this.favoritosList.length == 0) {
      localStorage.removeItem('FAVORITOS_LIST');
    }
    else {
      localStorage.setItem('FAVORITOS_LIST', JSON.stringify(this.favoritosList));
    }
    this.toastFavorito = this._accessi18nData['TOAST_FAVORITO_REMOVIDO'];
    this.presentToastFavorito();
    this.eventService.publishFavoritoNowPlaying({
      updateList: true
    });
  }

  async presentToastFavorito() {
    const toast = await this.toastController.create({
      message: this.toastFavorito,
      duration: 2000,
      position: 'bottom',
      cssClass: 'toast-custom-class',
    });
    toast.present();
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
