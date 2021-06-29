import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from "@ionic/angular";
import { EventService } from '../../../utilitarios/EventService';

import { BreathPage } from '../../breath/breath.page';

@Component({
  selector: 'app-mais',
  templateUrl: './mais.page.html',
  styleUrls: ['./mais.page.scss'],
})
export class MaisPage implements OnInit {

  constructor(private navCtrl: NavController,
              private _eventService: EventService,
              public modalCtrl: ModalController) { }

  ngOnInit() {
  }

  openAjustes() {
    this.navCtrl.navigateRoot('/tab3');
  }

  openParaVocePage() {
    this.navCtrl.navigateRoot('/para-voce');
  }

  async openBreath() {

    this._eventService.publishCloseModal({
      buttonClicked: true
    });

    const modal = await this.modalCtrl.create({
      component: BreathPage,
      cssClass: 'my-custom-modal-css',
      componentProps: {  }
    });
    return await modal.present();
  }

}
