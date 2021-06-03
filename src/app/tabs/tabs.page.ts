import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { NavController } from "@ionic/angular";

import { EventService } from '../../utilitarios/EventService';
import { TranslateConfigService } from '../services/translate-config.service';
import { MusicPlayerService } from '../services/music-player.service';

import { BreathPage } from '../breath/breath.page';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  activeTrack = [];
  public selectedSound = '';
  public pathImage = '';
  public porcentagemProgresso = 0;
  public labelCategoria = '';
  public isPlaying: boolean = false;
  public selectedLanguage:string;
  private accessi18nData: any;

  constructor(public modalCtrl: ModalController,
              private translateConfigService: TranslateConfigService,
              private musicService: MusicPlayerService,
              private http: HttpClient,
              private navCtrl: NavController,
              private eventService: EventService) {

    // aqui pego quando muda de som
    this.eventService.getObservable().subscribe((data) => {
      this.activeTrack = data;
      this.pathImage = this.activeTrack['activeTrack']['pathImage'];
      this.selectedSound = this.activeTrack['activeTrack']['labelName'];
      this.labelCategoria = this.activeTrack['activeTrack']['labelCategoria'];
      this.isPlaying = this.activeTrack['activeTrack']['isPlaying'];
    });

    // aqui fico atualizando a barra de progresso
    this.eventService.getPorcentagemProgresso().subscribe((porcentagemProgresso) => {
      this.porcentagemProgresso = porcentagemProgresso.porcentagemProgresso;
    });

  }

  ngOnInit() {
  }

  showModal(){
    const el = <HTMLElement>document.querySelector('.sc-ion-modal-md-h');
    el.style.setProperty('top', '0');
   }

   togglePlayer(pause: boolean) {
    this.isPlaying = this.musicService.setStatusPlayer(pause);
  }

  goToSounds() {
    this.navCtrl.navigateRoot('/tabs/tab2/');
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

}

