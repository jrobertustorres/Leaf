import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavParams, ToastController, LoadingController } from '@ionic/angular';
import { Howl } from 'howler';
import { IonRange } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

import { EventService } from '../../utilitarios/EventService';
import { MusicPlayerService } from '../services/music-player.service';
import { TranslateConfigService } from '../services/translate-config.service';
import { HttpClient } from '@angular/common/http';

import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media/ngx';


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
  private accessi18nData: any;

  isLoading = false;

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
              private httpC: HttpClient,
              private streamingMedia: StreamingMedia,
              private eventService: EventService) {

    this.accessi18nData = JSON.parse(localStorage.getItem('I18N_DICTIONARY'));
    this.isLooping = JSON.parse(localStorage.getItem('IS_LOOPING'));

    this.eventService.getObservableCloseModal().subscribe((data) => {
      this.buttonClicked = data.buttonClicked;
      if(this.buttonClicked) {
        this.closeModal();
      }
    });

    // aqui pego quando muda de som
    this.eventService.getObservable().subscribe((data) => {
      this.activeTrack = data;
      this.pathImage = this.activeTrack['activeTrack']['pathImage'];
      this.selectedSound = this.activeTrack['activeTrack']['labelName'];
      this.labelCategoria = this.activeTrack['activeTrack']['labelCategoria'];
      this.isPlaying = this.activeTrack['activeTrack']['isPlaying'];
      this.totalSoundDuration = this.activeTrack['activeTrack']['totalSoundDuration'];
      this.showPlayerButtons = this.totalSoundDuration != '' ? true : false;
    });

  }

  ngOnInit() {
    this.initializeMusicService();

    // let options: StreamingVideoOptions = {
    //   successCallback: () => { console.log('Video played') },
    //   errorCallback: (e) => { console.log('Error streaming') },
    //   orientation: 'portraid',
    //   shouldAutoClose: true,
    //   controls: false
    // };
    
    // this.streamingMedia.playVideo('https://repositoriocalm.s3.amazonaws.com/gifs/chuva-calma.mp4', options);
  }

  async presentLoading() {
    this.isLoading = true;
    return await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Buffering...',
      spinner: 'dots',
      // duration: 5000,
    }).then(a => {
      a.present().then(() => {
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }

  async dismissLoading() {
    this.isLoading = false;
    return await this.loadingController.dismiss();
  }

  async initializeMusicService() {
    // const loading = await this.loadingController.create({
    //   cssClass: 'my-custom-class',
    //   message: 'Buffering...',
    //   spinner: 'dots',
    //   duration: 1000
    // });
    // await loading.present();
    this.presentLoading();
    this.musicService.getMusic(this.soundValue);

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
        this.currentTimePlayer = this.musicService.updateCurrentTime(); // melhorar aqui para quando o currentTimePlayer zerado, não continuar chamando o metodo.
        if(this.currentTimePlayer == '00:00' && this.isLoading) {
          this.dismissLoading();
        }
    }, 1000);
    const interval = setInterval(() => {
      this.totalSoundDuration = this.musicService.returnTotalSoundDuration();
      if (this.totalSoundDuration != '0:00') {
        clearInterval(interval);
      }
    }, 100);
    // if(this.currentTimePlayer != undefined) {
    // // if(this.currentTimePlayer == '00:00') {
    //   // await loading.onDidDismiss();
    //   this.dismiss();
    // }

  }

  togglePlayer(pause: boolean) {
    this.isPlaying = this.musicService.setStatusPlayer(pause);
  }

  loopPlayer(looping: boolean) {
    this.isLooping = this.musicService.setStatusLoop(looping);
    this.loopToast = this.isLooping ? this.accessi18nData['REPETIR_ATIVADO'] : this.accessi18nData['REPETIR_DESATIVADO'];
    this.presentToastLoop();
  }
  
  hideModal(){
    let el = <HTMLElement>document.querySelector('.sc-ion-modal-md-h');
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
