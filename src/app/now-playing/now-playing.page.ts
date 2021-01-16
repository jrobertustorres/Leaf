import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavParams, ToastController, LoadingController } from '@ionic/angular';
import { Howl } from 'howler';
import { IonRange } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

import { EventService } from '../../utilitarios/EventService';
import { MusicPlayerService } from '../services/music-player.service';
import { TranslateConfigService } from '../services/translate-config.service';

export interface Track {
  id: number;
  name: string;
  path: string;
  pathImage: string;
  porcentagemProgresso: string;
  labelCategoria: string;
  totalSoundDuration: string;
  isPlaying: boolean;
}

@Component({
  selector: 'app-now-playing',
  templateUrl: './now-playing.page.html',
  styleUrls: ['./now-playing.page.scss'],
})
export class NowPlayingPage implements OnInit {
  @Input() soundValue: string;
  @Input() idSound: number;
  
  activeTrack: Track = null;
  player: Howl = null;
  isPlaying: boolean = true;
  isLooping: boolean = false;
  progress: number = 0;
  timePlayed: number = 0;
  totalSoundDuration: string = '';
  currentTimePlayer: string = '';
  idSoundInMemory: number = 0;
  isClick: boolean = false;
  buttonClicked: boolean = false;
  loopToast: string = '';
  doSpinner: boolean = true;
  showPlayerButtons: boolean = false;

  public pathImage = '';
  public path = '';
  public name = '';
  public labelCategoria = '';
  public loading;

  public selectedLanguage:string;

  backgroundImage: string;

  selectedSound: Track[] = [
    {
      id: 0,
      name: '',
      path: '',
      pathImage: '',
      porcentagemProgresso: '',
      labelCategoria: '',
      totalSoundDuration: '',
      isPlaying: true
    }
  ];
  @ViewChild('range', { static: false }) range: IonRange;

  constructor(public modalCtrl: ModalController,
              private navParams: NavParams,
              private nativeStorage: NativeStorage,
              private musicService: MusicPlayerService,
              private translateConfigService: TranslateConfigService,
              public toastController: ToastController,
              public loadingController: LoadingController,
              private eventService: EventService) {

    this.eventService.getObservableCloseModal().subscribe((data) => {
      this.buttonClicked = data.buttonClicked;
      if(this.buttonClicked) {
        this.closeModal();
      }
    });

    this.eventService.getObservable().subscribe((data) => {
      this.activeTrack = data;
      // this.path = this.activeTrack['activeTrack']['path'];
      this.pathImage = this.activeTrack['activeTrack']['pathImage'];
      this.name = this.activeTrack['activeTrack']['labelName'];
      this.labelCategoria = this.activeTrack['activeTrack']['labelCategoria'];
      this.isPlaying = this.activeTrack['activeTrack']['isPlaying'];
      this.totalSoundDuration = this.activeTrack['activeTrack']['totalSoundDuration'];
      this.showPlayerButtons = this.totalSoundDuration != '' ? true : false;
    });
    
  }
  
  ngOnInit() {
    this.initializeMusicService();
  }

  async initializeMusicService() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Buffering...',
      spinner: 'dots',
      duration: 1000
    });
    await loading.present();
    
    this.musicService.getMusic(this.soundValue);
    // let activeTrack = this.musicService.getMusic(this.soundValue);
    // this.path = activeTrack.path;
    // this.pathImage = activeTrack.pathImage;
    // this.name = activeTrack.name;
    // this.labelCategoria = activeTrack.labelCategoria;

    this.progress = this.musicService.updateProgress();
    this.currentTimePlayer = this.musicService.updateCurrentTime();
    // aqui tenho que esperar um pouco para atualizar estes dados na tela
    setInterval(() => {
      // só preciso chamar uma vez
      // if(!this.totalSoundDuration) {
      //   this.totalSoundDuration = activeTrack.totalSoundDuration;
      // }
      // tenho que atualizar constantemente - em tempo real
      this.progress = this.musicService.updateProgress();
      this.currentTimePlayer = this.musicService.updateCurrentTime();
    }, 1000);
    const interval = setInterval(() => {
      this.totalSoundDuration = this.musicService.returnTotalSoundDuration();
      if (this.totalSoundDuration != '0:00') {
        clearInterval(interval);
      }
    }, 100);

    if(this.totalSoundDuration != '') {
      await loading.onDidDismiss();
    }

  }

  togglePlayer(pause: boolean) {
    this.isPlaying = this.musicService.setStatusPlayer(pause);
  }

  loopPlayer(looping: boolean) {
    this.isLooping = this.musicService.setStatusLoop(looping);
    this.loopToast = this.isLooping ? 'Repetir ativado' : 'Repetir desativado';
    this.presentToastLoop();
  }
  
  hideModal(){
    const el = <HTMLElement>document.querySelector('.sc-ion-modal-md-h');
    el.style.setProperty('top', '100%');
  }
  
  closeModal() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  async presentToastLoop() {
    const toast = await this.toastController.create({
      message: this.loopToast,
      duration: 2000,
      position: 'bottom',
      cssClass: 'toast-custom-class',
    });
    toast.present();
  }

  seek() {
    this.player = this.musicService.seek();
    let newValue = +this.range.value;
    let duration = this.player.duration();
    this.player.seek(duration * (newValue / 100));
  }
    
}
