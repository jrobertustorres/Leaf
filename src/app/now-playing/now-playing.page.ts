import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavParams, ToastController, LoadingController, IonRange } from '@ionic/angular';
import { Howl } from 'howler';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { EventService } from '../../utilitarios/EventService';
import { MusicPlayerService } from '../services/music-player.service';
import { TranslateConfigService } from '../services/translate-config.service';
import { HttpClient } from '@angular/common/http';

import { PopoverController } from '@ionic/angular';
import { MusicInformationComponent } from '../popovers/music-information/music-information.component';

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
  @Input() nameRadio: string;
  // @Input() categoriaRadio: string;
  @Input() categoria: string;
  @Input() albumValue: string;
  
  activeTrack: Track = null;
  player: Howl = null;
  isPlaying: boolean = true;
  shouldDisable: boolean = false;
  isLooping: boolean = false;
  progress: number = 0;
  timePlayed: number = 0;
  totalSoundDuration: string = '';
  currentTimePlayer: string = '';
  idSoundInMemory: number = 0;
  isClick: boolean = false;
  buttonClicked: boolean = false;
  buttonPlayerIsPlaying: boolean = false;
  loopToast: string = '';
  toastFavorito: string = '';
  doSpinner: boolean = true;
  showPlayerButtons: boolean = false;

  public pathImage = '';
  public path = '';
  public name = '';
  public labelCategoria = '';
  public labelAutor = '';
  public labelSong = '';
  public loading;
  public selectedLanguage:string;
  backgroundImage: string;
  private accessi18nData: any;
  playingRadio: boolean;
  eFavorito: boolean = false;
  public soundState: string;
  isLoading = false;
  loaded = false;
  // public favoritosList: Object[] = [];
  public favoritosList: Array<string> = [];
  public playList: Array<string> = [];
  public playListToShow: Array<string> = [];

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
              public popoverController: PopoverController,
              private eventService: EventService) {

    this.accessi18nData = JSON.parse(localStorage.getItem('I18N_DICTIONARY'));
    this.isLooping = JSON.parse(localStorage.getItem('IS_LOOPING'));

    this.eventService.getObservableCloseModal().subscribe((dataModal) => {
      this.buttonClicked = dataModal.buttonClicked;
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
      this.categoria = this.activeTrack['activeTrack']['categoria'];
      this.labelAutor = this.activeTrack['activeTrack']['labelAutor'];
      this.labelSong = this.activeTrack['activeTrack']['labelSong'];
      this.soundValue = this.activeTrack['activeTrack']['soundValue'];
      this.isPlaying = this.activeTrack['activeTrack']['isPlaying'];
      this.playingRadio = this.activeTrack['activeTrack']['playingRadio'];
      this.totalSoundDuration = this.activeTrack['activeTrack']['totalSoundDuration'];
      this.showPlayerButtons = this.totalSoundDuration != '' ? true : false;
      this.soundState = this.activeTrack['activeTrack']['state'];
    });
    
    this.eventService.getPlaylistToShow().subscribe((dataList) => {
      this.playListToShow = dataList.playListToShow;
    });

    this.eventService.updateFavoritoNowPlaying().subscribe((data) => {
      this.verificaFavorito();
    });

    this.eventService.getObservableButtonPlayer().subscribe((dataButton) => {
      this.isPlaying = dataButton.buttonPlayerIsPlaying;
    });

  }
  
  ngOnInit() {
    // localStorage.removeItem('FAVORITOS_LIST');
    // this.playingRadio = this.categoriaRadio ? true : false;
    if(this.categoria === 'RADIO') {
      this.playingRadio = true;
      this.soundState = undefined;
      this.pathImage = 'assets/imgs/tokyo2.webp';//seto direto aqui para carregar imediatamente pois a img já está embarcada
      this.initializeRadioService();
    } else {
      this.playingRadio = false;
      this.initializeMusicService();
    }
  }

  ionViewDidLoad(){
  }
  
  ionViewDidEnter() {
  }

  ionViewWillEnter() {
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: MusicInformationComponent,
      componentProps: { playListToShow: this.playListToShow },
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
  }
  
  async dismissLoading() {
    this.isLoading = false;
    return await this.loadingController.dismiss();
  }
  
  async initializeMusicService() {
    
    if(this.categoria == 'MUSICA') {
      this.musicService.getPlayList(this.categoria, this.albumValue);
    } else {
      this.musicService.getMusic(this.soundValue, this.categoria);
    }
    // if(this.isPlaying) {
    this.progress = this.musicService.updateProgress();
    // }
    this.currentTimePlayer = this.musicService.updateCurrentTime();

    // aqui tenho que esperar um pouco para atualizar estes dados na tela
    setInterval(() => {
      // só preciso chamar uma vez
      // if(!this.totalSoundDuration) {
        //   this.totalSoundDuration = activeTrack.totalSoundDuration;
        // }
        // tenho que atualizar constantemente - em tempo real
        // if(this.isPlaying) {
        this.progress = this.musicService.updateProgress();
        // }
        this.currentTimePlayer = this.musicService.updateCurrentTime(); // melhorar aqui para quando o currentTimePlayer zerado, não continuar chamando o metodo.
        
        if(this.currentTimePlayer == '00:00' && this.isLoading) {
        // if(this.currentTimePlayer == '00:00' && this.soundState == 'loaded') {
          // this.dismissLoading();
        }
    }, 1000);
    const interval = setInterval(() => {
      this.totalSoundDuration = this.musicService.returnTotalSoundDuration();

      if (this.soundState == 'loaded') {
        this.loaded = true;
        clearInterval(interval);
      }
    }, 100);
    this.verificaFavorito();
  }

  async initializeRadioService() {
    this.musicService.getRadio(this.nameRadio, this.categoria);
    const interval = setInterval(() => {
      if (this.soundState == 'loaded') {
        this.loaded = true;
        clearInterval(interval);
      }
    }, 1);
  }

  togglePlayer(pause: boolean) {
    this.isPlaying = this.musicService.setStatusPlayer(pause);
    //usado quando é radio para ativar ou desativar as barras laranjas
    if(this.categoria == 'RADIO') {
      let player = document.getElementById("music");
      player.classList.toggle("paused");
    }

    this.shouldDisable = true;
    setTimeout(() => {
      this.shouldDisable = false;
      }, 500);
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

  async presentToastFavorito() {
    const toast = await this.toastController.create({
      message: this.toastFavorito,
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

  verificaFavorito() {
    this.favoritosList = JSON.parse(localStorage.getItem('FAVORITOS_LIST'));
    if(this.favoritosList) {
      for(let i in this.favoritosList) {
        if(this.favoritosList[i]['soundValue'] == this.soundValue) {
          this.eFavorito = true;
        } else {
          this.eFavorito = false;
        }
      }
    } else {
      this.eFavorito = false;
      this.eventService.publishUpdateFavoritosList({
        updateList: true
      });
    }
  }

  setFavorito() {
    this.eFavorito = !this.eFavorito;
    this.favoritosList = JSON.parse(localStorage.getItem('FAVORITOS_LIST'));
    if(this.eFavorito) {
      this.adicionaFavorito();
    } else {
      this.removeFavorito();
    }
    this.eventService.publishUpdateFavoritosList({
      updateList: true
    });
  }
           
  adicionaFavorito() {
    let favoritosArray : Array<string> = [];
    favoritosArray = this.favoritosList ? this.favoritosList : favoritosArray;
    favoritosArray.push(this.activeTrack['activeTrack']);
    localStorage.setItem('FAVORITOS_LIST', JSON.stringify(favoritosArray));

    this.toastFavorito = this.accessi18nData['TOAST_FAVORITO_ADICIONADO'];
    this.presentToastFavorito();
  }

  removeFavorito() {
    this.favoritosList.forEach((element,index)=>{
      if(element['soundValue'] == this.soundValue) this.favoritosList.splice(index,1);
   });
        
    if(this.favoritosList.length == 0) {
      localStorage.removeItem('FAVORITOS_LIST');
    }
    else {
      localStorage.setItem('FAVORITOS_LIST', JSON.stringify(this.favoritosList));
    }
    this.toastFavorito = this.accessi18nData['TOAST_FAVORITO_REMOVIDO'];
    this.presentToastFavorito();
  }

  // async presentLoading() {
  //   this.isLoading = true;
  //   return await this.loadingController.create({
  //     cssClass: 'my-custom-class',
  //     message: 'Buffering...',
  //     spinner: 'dots',
  //     // backdropDismiss: true
  //     // duration: 5000,
  //   }).then(a => {
  //     a.present().then(() => {
  //       if (!this.isLoading) {
  //         a.dismiss();
  //       }
  //     });
  //   });
  // }
    
}
