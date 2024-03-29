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
  buttonPlayerIsPlaying: boolean = false;
  public labelCategoria = '';
  public isPlaying: boolean = false;
  shouldDisable: boolean = false;
  public selectedLanguage:string;
  playingRadio: boolean;
  public soundState: string;
  public labelSong: string = '';
  public labelAutor: string = '';

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
      this.labelSong = this.activeTrack['activeTrack']['labelSong'];
      this.isPlaying = this.activeTrack['activeTrack']['isPlaying'];
      this.playingRadio = this.activeTrack['activeTrack']['playingRadio'];
      this.soundState = this.activeTrack['activeTrack']['state'];
      this.labelAutor = this.activeTrack['activeTrack']['labelAutor'];
    });

    // aqui fico atualizando a barra de progresso
    this.eventService.getPorcentagemProgresso().subscribe((porcentagemProgresso) => {
      this.porcentagemProgresso = porcentagemProgresso.porcentagemProgresso;
    });

    this.eventService.getObservableButtonPlayer().subscribe((dataButton) => {
      this.isPlaying = dataButton.buttonPlayerIsPlaying;
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

    //usado quando é radio para ativar ou desativar as barras laranjas
    if(this.playingRadio) {
      let player = document.getElementById("music");
      player.classList.toggle("paused");
    }

    this.shouldDisable = true;
    setTimeout(() => {
      this.shouldDisable = false;
    }, 500);
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

