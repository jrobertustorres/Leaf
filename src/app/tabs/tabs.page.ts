import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

import { EventService } from '../../utilitarios/EventService';
import { TranslateConfigService } from '../services/translate-config.service';
import { MusicPlayerService } from '../services/music-player.service';

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
              private eventService: EventService) {

    this.selectedLanguage = this.translateConfigService.getDefaultLanguage();

    // aqui pego quando muda de som
    this.eventService.getObservable().subscribe((data) => {
      this.activeTrack = data;
      this.pathImage = this.activeTrack['activeTrack']['pathImage'];
      // this.porcentagemProgresso = this.activeTrack['activeTrack']['porcentagemProgresso'];

      this.labelCategoria = this.activeTrack['activeTrack']['labelCategoria'];
      // this.labelCategoria = localStorage.getItem('LABEL_CATEGORIA') ? localStorage.getItem('LABEL_CATEGORIA') : this.labelCategoria;

      this.isPlaying = this.activeTrack['activeTrack']['isPlaying'];
      // setTimeout(() => {
      this.selectedSound = this.activeTrack['activeTrack']['labelName'];
      // this.selectedSound = this.activeTrack['activeTrack']['name'];
      
        // console.log(this.selectedSound);
      // }, 500);
      
    });

    // aqui fico atualizando a barra de progresso
    this.eventService.getPorcentagemProgresso().subscribe((porcentagemProgresso) => {
      this.porcentagemProgresso = porcentagemProgresso.porcentagemProgresso;
    });

  }

  ngOnInit() {
    this.translateConfigService.setLanguage(this.selectedLanguage);
  }

  showModal(){
    const el = <HTMLElement>document.querySelector('.sc-ion-modal-md-h');
    el.style.setProperty('top', '0');
   }

   togglePlayer(pause: boolean) {
    this.isPlaying = this.musicService.setStatusPlayer(pause);
  }

}

