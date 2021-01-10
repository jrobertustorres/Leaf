import { Injectable, Input, ViewChild } from '@angular/core';
import { IonRange } from '@ionic/angular';
import { Howl } from 'howler';
import { EventService } from '../../utilitarios/EventService';
import { TranslateConfigService } from '../services/translate-config.service';
import { HttpClient } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';

export interface Track {
  id: number;
  name: string;
  labelName: string;
  path: string;
  pathImage: string;
  porcentagemProgresso: string;
  totalSoundDuration: string;
  categoria: string;
  labelCategoria: string;
  soundValue: string;
  isPlaying: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MusicPlayerService {
  @Input() soundValue: string;

  activeTrack: Track = null;
  player: Howl = null;
  isPlaying: boolean = false;
  isLooping: boolean = false;
  progress: number = 0;
  timePlayed: number = 0;
  totalSoundDuration: string = '';
  currentTime: string;
  idSoundInMemory: number = 0;
  isClick: boolean = false;
  selectedLanguage: string;
  private accessi18nData: any;

  selectedSound: Track[] = [
    {
      id: 0,
      name: '',
      labelName: '',
      path: '',
      pathImage: '',
      porcentagemProgresso: '',
      totalSoundDuration: '',
      categoria: '',
      labelCategoria: '',
      soundValue: '',
      isPlaying: true
    }
  ];
  @ViewChild('range', { static: false }) range: IonRange;
  constructor(private translateConfigService: TranslateConfigService,
              private httpC: HttpClient,
              // private http: HTTP,
              public loadingController: LoadingController,
              private eventService: EventService) {
    this.selectedLanguage = this.translateConfigService.getDefaultLanguage();

    this.httpC.get('assets/i18n/'+localStorage.getItem('IDIOMA_USUARIO')+'.json').subscribe(data => {
      this.accessi18nData = data;
    });
    
    this.getChangeLanguage();
    
  }
  
  getChangeLanguage() {
    this.eventService.getObservableChangeLanguage().subscribe((data) => {
      this.selectedLanguage = data.selectedLanguage;
      this.httpC.get('assets/i18n/'+localStorage.getItem('IDIOMA_USUARIO')+'.json').subscribe(data => {
        this.accessi18nData = data;
        
        for(let i in this.accessi18nData['TABS']['CATEGORIA']){
          if(i == this.selectedSound[0]['categoria'].toUpperCase()) {
            this.selectedSound[0]['labelCategoria'] = this.accessi18nData['TABS']['CATEGORIA'][i];
            this.selectedSound[0]['labelName'] = this.accessi18nData['TABS'][this.selectedSound[0]['name']];
          }
        };

      });
    });
  }

   ngOnInit() {
  }

  /**
   * Format the time from seconds to M:SS.
   * @param  {Number} secs Seconds to format.
   * @return {String}      Formatted time.
   */
  formatTime(secs: number) {
    var minutes = Math.floor(secs / 60) || 0;
    var seconds = (secs - minutes * 60) || 0;

    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  }

  start(track: Track) {
    this.isPlaying = false;
    console.log(track.path);

    
    if(this.player) {
      this.player.stop();
    }
    this.player = new Howl({
      src: [track.path],
      html5: true,
      loop: this.isLooping,
      onload: () => {
        console.log('onload <===');
        // this.totalSoundDuration = this.formatTime(Math.round(this.player.duration()));
      },
      onplay: () => {
        console.log('dentro do onplay');
        this.totalSoundDuration = this.formatTime(Math.round(this.player.duration()));
        this.selectedSound[0]['totalSoundDuration'] = this.totalSoundDuration;
        this.isPlaying = true;
        this.activeTrack = track;
        this.updateProgress();
      },
      onend: () => {
        this.activeTrack = track;
        this.isPlaying = false;
      }
    });
    this.player.play();

    // console.log('passei aqui 1');
    // this.eventService.publishData({
    //   activeTrack: this.selectedSound[0]
    // });

  }

  stopPlayer() {
    if(this.isPlaying) {
      this.player.stop();
    }
  }

  setStatusPlayer(pause: boolean) {
    this.isPlaying = !pause;
    if(pause) {
      this.player.pause();
    } else {
      this.player.play();
    }
    return this.isPlaying;
  }

  setStatusLoop(looping: boolean) {
    this.isLooping = !looping;
    return this.isLooping;
  }

  returnStatusPlayer() {
    return this.isPlaying;
  }

  seek() {
    return this.player;
  }

  returnTotalSoundDuration() {
    this.totalSoundDuration = this.formatTime(Math.round(this.player.duration()));
    return this.totalSoundDuration;
  }

  updateCurrentTime() {
    try {

      let seek = this.player.seek();
      let date = new Date(null);
      date.setSeconds(seek); // specify value for SECONDS here
      this.currentTime = date.toISOString().substr(14, 5);
      // this.currentTime = date.toISOString().substr(11, 8);
      return this.currentTime;
    }
    catch (err){
      if(err instanceof RangeError){
        // console.log('ERROR RangeError: Invalid time value');
      }
      // console.log(err);
    }
  }
    
  updateProgress() {
    try {
      let seek = this.player.seek();
      this.progress = (seek / this.player.duration()) * 100 || 0;

      // atualiza a barra de progresso quando o player está minimizado
      this.selectedSound[0]['porcentagemProgresso'] = this.progress < 10 ? '0.0'+this.progress : '0.'+this.progress.toFixed(0);
      this.selectedSound[0]['isPlaying'] = this.isPlaying;

      if(!this.isPlaying) {
        this.selectedSound[0]['isPlaying'] = false;
      }
      /** atualiza o player minimizado na tela tabs.page */
      this.eventService.publishData({
        activeTrack: this.selectedSound[0]
      });

      this.eventService.publishPorcentagemProgresso({
        porcentagemProgresso: this.selectedSound[0]['porcentagemProgresso']
      });
      
      setTimeout(() => {
        this.updateProgress();
      }, 1000);
      
      return this.progress;
    }
    catch (err){
      if(err instanceof RangeError){
        console.log('ERROR RangeError');
      }
      console.log(err);
    }
  }

  getMusic(soundValue: string) {
    console.log(soundValue);
    switch(soundValue) {
      case 'chuva-trovao': {
        this.selectedSound = [
          {
            id: 1,
            name: this.accessi18nData['TABS']['NOME_SOM_CHUVA']['CHUVA_TROVOADAS'],
            labelName: this.selectedSound[0]['labelName'] ? this.selectedSound[0]['labelName'] : this.accessi18nData['TABS']['CHUVA_TROVOADAS'],
            // labelName: this.accessi18nData['TABS']['CHUVA_TROVOADAS'],
            // name: 'Chuva com trovoadas',
            // path: 'https://www.dropbox.com/home/sons/chuva/mp3?preview=chuva-trovoadas.mp3',
            path: 'https://drive.google.com/uc?id=1f4M15doUW-RQCONFGMYM8IXME7NNi23I',
            // path: 'https://drive.google.com/uc?export=download&id=1f4M15doUW-RQCONFGMYM8IXME7NNi23I',
            pathImage: 'https://media.giphy.com/media/P0ar8pIucRwje/giphy.gif',
            porcentagemProgresso: '',
            totalSoundDuration: '',
            categoria: 'CHUVA',
            labelCategoria: this.accessi18nData['TABS']['CHUVA_LOWERCASE'],
            soundValue: 'chuva-trovao',
            isPlaying: this.isPlaying
          }
        ];
        break; 
      } 
      case 'chuva-calma': { 
        this.selectedSound = [
          {
            id: 2,
            // name: 'Chuva calma',
            name: this.accessi18nData['TABS']['NOME_SOM_CHUVA']['CHUVA_CALMA'],
            labelName: this.selectedSound[0]['labelName'],
            // labelName: this.accessi18nData['TABS']['CHUVA_CALMA'],
            path: 'https://drive.google.com/uc?id=1Ihx0VUdKin8XIIndA5fBE40ypZx-OZHv',
            // path: 'https://drive.google.com/uc?export=download&id=1Ihx0VUdKin8XIIndA5fBE40ypZx-OZHv',
            pathImage: 'https://media.giphy.com/media/5torEEM8QnR95Cqg11/giphy.gif',
            porcentagemProgresso: '',
            totalSoundDuration: '',
            categoria: 'CHUVA',
            labelCategoria: this.accessi18nData['TABS']['CHUVA_LOWERCASE'],
            soundValue: 'chuva-calma',
            isPlaying: this.isPlaying
          }
        ];
          break; 
      } 
      case 'passaros': {
        this.selectedSound = [
          {
            id: 1,
            // name: 'Pássaros no lago',
            name: this.accessi18nData['TABS']['NOME_SOM_PASSAROS']['PASSAROS_LAGO'],
            labelName: this.accessi18nData['TABS']['PASSAROS_LAGO'],
            path: 'https://drive.google.com/uc?id=1D-e_NfVmC7Qcg8UpPvpgUW23dYByERJ0',
            // path: 'https://drive.google.com/uc?export=download&id=1D-e_NfVmC7Qcg8UpPvpgUW23dYByERJ0',
            pathImage: 'https://media.giphy.com/media/SzUtv3rO40xhu/giphy.gif',
            porcentagemProgresso: '',
            totalSoundDuration: '',
            categoria: 'PASSAROS',
            labelCategoria: this.accessi18nData['TABS']['PASSAROS_LOWERCASE'],
            soundValue: 'passaros',
            isPlaying: this.isPlaying
          }
        ];
        break; 
      } 
      case 'passaros2': {
        this.selectedSound = [
          {
            id: 1,
            // name: 'Pássaros na Floresta',
            name: this.accessi18nData['TABS']['NOME_SOM_PASSAROS']['PASSAROS_FLORESTA'],
            labelName: this.accessi18nData['TABS']['PASSAROS_FLORESTA'],
            path: 'https://drive.google.com/uc?id=1ZjGMBwJDUE-cdU3OdK0hs-rLguHfBp4P',
            // path: 'https://drive.google.com/uc?export=download&id=1ZjGMBwJDUE-cdU3OdK0hs-rLguHfBp4P',
            pathImage: 'https://media.giphy.com/media/YB5Wcg2zQWSDC/giphy.gif',
            porcentagemProgresso: '',
            totalSoundDuration: '',
            categoria: 'PASSAROS',
            labelCategoria: this.accessi18nData['TABS']['PASSAROS_LOWERCASE'],
            soundValue: 'passaros2',
            isPlaying: this.isPlaying
          }
        ];
        break; 
      } 
      case 'fogueira': {
        this.selectedSound = [
          {
            id: 1,
            // name: 'Fogueira',
            name: this.accessi18nData['TABS']['NOME_SOM_FOGO']['FOGUEIRA'],
            labelName: this.accessi18nData['TABS']['FOGUEIRA'],
            path: 'https://drive.google.com/uc?id=17kvbKQblVkXXbdSZJIuNkb_fpz7hBOvL',
            // path: 'https://drive.google.com/uc?export=download&id=17kvbKQblVkXXbdSZJIuNkb_fpz7hBOvL',
            pathImage: 'https://media.giphy.com/media/7BsBA553QcgiA/giphy.gif',
            porcentagemProgresso: '',
            totalSoundDuration: '',
            categoria: 'FOGO',
            labelCategoria: this.accessi18nData['TABS']['FOGO'],
            soundValue: 'fogueira',
            isPlaying: this.isPlaying
          }
        ];
        break; 
      } 
      case 'ventania': {
        this.selectedSound = [
          {
            id: 1,
            // name: 'Ventania na montanha',
            name: this.accessi18nData['TABS']['NOME_SOM_VENTO']['VENTANIA_NO_CAMPO'],
            labelName: this.accessi18nData['TABS']['VENTANIA_NO_CAMPO'],
            path: 'https://drive.google.com/uc?id=15FWKFey__IR_SxA5LGg7Wvn9KnO8MsJA',
            // path: 'https://drive.google.com/uc?export=download&id=15FWKFey__IR_SxA5LGg7Wvn9KnO8MsJA',
            pathImage: 'https://media.giphy.com/media/clzp5RgHabMagyQIG9/giphy.gif',
            porcentagemProgresso: '',
            totalSoundDuration: '',
            categoria: 'VENTO',
            labelCategoria: this.accessi18nData['TABS']['VENTO'],
            soundValue: 'ventania',
            isPlaying: this.isPlaying
          }
        ];
        break; 
      } 
      case 'floresta-congelada': {
        this.selectedSound = [
          {
            id: 1,
            // name: 'Floresta congelada',
            name: this.accessi18nData['TABS']['NOME_SOM_VENTO']['FLORESTA_CONGELADA'],
            labelName: this.accessi18nData['TABS']['FLORESTA_CONGELADA'],
            path: 'https://drive.google.com/uc?&id=1Idf5ozJaEcPsFVNkC9duKZOtZ9q8cpBx',
            // path: 'https://drive.google.com/uc?export=download&id=1Idf5ozJaEcPsFVNkC9duKZOtZ9q8cpBx',
            pathImage: 'https://media.giphy.com/media/xfa1GclK0WaOc/giphy.gif',
            porcentagemProgresso: '',
            totalSoundDuration: '',
            categoria: 'VENTO',
            labelCategoria: this.accessi18nData['TABS']['VENTO'],
            soundValue: 'floresta-congelada',
            isPlaying: this.isPlaying
          }
        ];
        break; 
      } 
      case 'retro1': {
        this.selectedSound = [
          {
            id: 1,
            // name: 'Retro 1',
            name: this.accessi18nData['TABS']['NOME_SOM_SYNTHWAVE']['RETRO1'],
            labelName: this.accessi18nData['TABS']['RETRO1'],
            path: 'https://drive.google.com/uc?id=1X9ALhoZzM2NqxhUF--LllZVtZY69D-vr',
            // path: 'https://drive.google.com/uc?export=download&id=1X9ALhoZzM2NqxhUF--LllZVtZY69D-vr',
            pathImage: 'https://media.giphy.com/media/wKnqovL33x9in9ci6X/giphy.gif',
            porcentagemProgresso: '',
            totalSoundDuration: '',
            categoria: 'SYNTHWAVE',
            labelCategoria: this.accessi18nData['TABS']['SYNTHWAVE'],
            soundValue: 'retro1',
            isPlaying: this.isPlaying
          }
        ];
        break; 
      } 
      case 'retro2': {
        this.selectedSound = [
          {
            id: 1,
            // name: 'Cyber Edge',
            name: this.accessi18nData['TABS']['NOME_SOM_SYNTHWAVE']['RETRO2'],
            labelName: this.accessi18nData['TABS']['RETRO2'],
            path: 'https://drive.google.com/uc?id=1VPtH5KcM16pzH5g6lFtR2RdWjyc_bV5A',
            // path: 'https://drive.google.com/uc?export=download&id=1VPtH5KcM16pzH5g6lFtR2RdWjyc_bV5A',
            pathImage: 'https://media.giphy.com/media/dsd7XbYg0e6hG0A7i8/giphy.gif',
            porcentagemProgresso: '',
            totalSoundDuration: '',
            categoria: 'SYNTHWAVE',
            labelCategoria: this.accessi18nData['TABS']['SYNTHWAVE'],
            soundValue: 'retro2',
            isPlaying: this.isPlaying
          }
        ];
        break; 
      } 
      case 'frequencia-reconexao': {
        this.selectedSound = [
          {
            id: 1,
            // name: 'Frequência de Reconexão com a Fonte',
            name: this.accessi18nData['TABS']['NOME_SOM_ENERGIA_POSITIVA']['FREQUENCIA_RECONEXAO'],
            labelName: this.accessi18nData['TABS']['FREQUENCIA_RECONEXAO'],
            path: 'https://drive.google.com/uc?id=13WO5j_bFIKCQqM6Ppa9prhnL1lS1kw8y',
            // path: 'https://drive.google.com/uc?export=download&id=13WO5j_bFIKCQqM6Ppa9prhnL1lS1kw8y',
            pathImage: 'https://media.giphy.com/media/xT0xetq8fErCoByquk/giphy.gif',
            porcentagemProgresso: '',
            totalSoundDuration: '',
            categoria: 'ENERGIA_POSITIVA',
            labelCategoria: this.accessi18nData['TABS']['ENERGIA_POSITIVA'],
            soundValue: 'frequencia-reconexao',
            isPlaying: this.isPlaying
          }
        ];
        break; 
      } 
      case 'energia-positiva-frequencia-de-432-hz': {
        this.selectedSound = [
          {
            id: 1,
            // name: 'Energia positiva - Frequência 432 Hz',
            name: this.accessi18nData['TABS']['NOME_SOM_ENERGIA_POSITIVA']['FREQUENCIA_432'],
            labelName: this.accessi18nData['TABS']['FREQUENCIA_432'],
            path: 'https://drive.google.com/uc?id=1x_F-5o9HlwBORcdYeMcULFscTrv7X0AR',
            // path: 'https://drive.google.com/uc?export=download&id=1x_F-5o9HlwBORcdYeMcULFscTrv7X0AR',
            pathImage: 'https://media.giphy.com/media/xUA7b5B6G21I3uKNDW/giphy.gif',
            porcentagemProgresso: '',
            totalSoundDuration: '',
            categoria: 'ENERGIA_POSITIVA',
            labelCategoria: this.accessi18nData['TABS']['ENERGIA_POSITIVA'],
            soundValue: 'energia-positiva-frequencia-de-432-hz',
            isPlaying: this.isPlaying
          }
        ];
        break; 
      } 
      default: { 
          //statements; 
          break; 
      } 
    }
    this.start(this.selectedSound[0]);
    /** atualiza o player minimizado na tela tabs.page */
    // this.eventService.publishData({
    //   activeTrack: this.selectedSound[0]
    // });

    console.log(this.selectedSound[0]);

    return this.selectedSound[0];

  }


}
