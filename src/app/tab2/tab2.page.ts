import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { EventService } from '../../utilitarios/EventService';
import { NowPlayingPage } from '../now-playing/now-playing.page';
import { AdmobService } from '../services/admob.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  segmentModel = "all";
  @Input() soundValue: string;// pega o parâmetro passado

  constructor(private eventService: EventService,
              private admobService: AdmobService,
              public modalCtrl: ModalController) {
              }

  ngOnInit() {
    this.admobService.ShowRewardVideo();
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
