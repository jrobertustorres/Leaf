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
              public loadingController: LoadingController,
              private eventService: EventService) {
    this.selectedLanguage = this.translateConfigService.getDefaultLanguage();

    this.httpC.get('assets/i18n/'+this.selectedLanguage+'.json').subscribe(data => {
      this.accessi18nData = data;
    });
    
    this.getChangeLanguage();

    // this.searchData();
    
  }
  
  ngOnInit() {
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
    
    if(this.player) {
      this.player.stop();
      this.player.unload();
    }
    this.player = new Howl({
      src: [track.path],
      html5: true,
      loop: this.isLooping,
      onload: () => {
        // this.totalSoundDuration = this.formatTime(Math.round(this.player.duration()));
      },
      onplay: () => {
        this.totalSoundDuration = this.formatTime(Math.round(this.player.duration()));
        this.selectedSound[0]['totalSoundDuration'] = this.totalSoundDuration;
        this.isPlaying = true;
        this.activeTrack = track;
        localStorage.setItem('STATUS_PLAYER', 'false');
        this.updateProgress();
      },
      onend: () => {
        this.activeTrack = track;
        this.isPlaying = false;
      }
    });
    this.player.play();

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

  // searchData(): Observable<any> {
  //   console.log('aaaaaaaaa');
  //   let results;
  //   return this.httpC.get('https://www.dropbox.com/s/gm0z23gr0jnlqnc/package-lock.json?dl=0').pipe(
  //     map(results => results['Search'])
  //   );
  //   console.log(results);
  // }

  // Http Options
  // httpOptions = {
  //   headers: new HttpHeaders({
  //     'Content-Type': 'application/json'
  //   })
  // }



  getMusic(soundValue: string) {
      switch(soundValue) {
        case 'chuva-trovao': {
          this.selectedSound = [
            {
              id: 1,
              name: this.accessi18nData['TABS']['NOME_SOM_CHUVA']['CHUVA_TROVOADAS'],
              labelName: this.accessi18nData['TABS']['CHUVA_TROVOADAS'],
              path: 'assets/sons/chuva/mp3/chuva-trovoadas.webm',
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
              name: this.accessi18nData['TABS']['NOME_SOM_CHUVA']['CHUVA_CALMA'],
              labelName: this.accessi18nData['TABS']['CHUVA_CALMA'],
              path: 'assets/sons/chuva/mp3/chuva-calma.webm',
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
              name: this.accessi18nData['TABS']['NOME_SOM_PASSAROS']['PASSAROS_LAGO'],
              labelName: this.accessi18nData['TABS']['PASSAROS_LAGO'],
              path: 'assets/sons/passaros/mp3/passaros1.webm',
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
              name: this.accessi18nData['TABS']['NOME_SOM_PASSAROS']['PASSAROS_FLORESTA'],
              labelName: this.accessi18nData['TABS']['PASSAROS_FLORESTA'],
              path: 'assets/sons/passaros/mp3/passaros2.webm',
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
              name: this.accessi18nData['TABS']['NOME_SOM_FOGO']['FOGUEIRA'],
              labelName: this.accessi18nData['TABS']['FOGUEIRA'],
              path: 'assets/sons/fogo/mp3/fogueira.webm',
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
              name: this.accessi18nData['TABS']['NOME_SOM_VENTO']['VENTANIA_NO_CAMPO'],
              labelName: this.accessi18nData['TABS']['VENTANIA_NO_CAMPO'],
              path: 'assets/sons/vento/mp3/ventania.webm',
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
              name: this.accessi18nData['TABS']['NOME_SOM_VENTO']['FLORESTA_CONGELADA'],
              labelName: this.accessi18nData['TABS']['FLORESTA_CONGELADA'],
              path: 'assets/sons/vento/mp3/floresta-congelada.webm',
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
              name: this.accessi18nData['TABS']['NOME_SOM_SYNTHWAVE']['RETRO1'],
              labelName: this.accessi18nData['TABS']['RETRO1'],
              path: 'assets/sons/synthwave/mp3/retro-lsd.webm',
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
              name: this.accessi18nData['TABS']['NOME_SOM_SYNTHWAVE']['RETRO2'],
              labelName: this.accessi18nData['TABS']['RETRO2'],
              path: 'assets/sons/synthwave/mp3/cyber-edge.webm',
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
              name: this.accessi18nData['TABS']['NOME_SOM_ENERGIA_POSITIVA']['FREQUENCIA_RECONEXAO'],
              labelName: this.accessi18nData['TABS']['FREQUENCIA_RECONEXAO'],
              path: 'assets/sons/energia/mp3/reconexao-com-a-fonte.webm',
              pathImage: 'https://media.giphy.com/media/RGLkqjTQ7ehZS/giphy.gif',
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
              name: this.accessi18nData['TABS']['NOME_SOM_ENERGIA_POSITIVA']['FREQUENCIA_432'],
              labelName: this.accessi18nData['TABS']['FREQUENCIA_432'],
              path: 'assets/sons/energia/mp3/frequencia-de-432-hz.webm',
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
        case 'som-binaural-20-hz': {
          this.selectedSound = [
            {
              id: 1,
              name: this.accessi18nData['TABS']['NOME_SOM_BINAURAL']['BINAURAL_20_HZ'],
              labelName: this.accessi18nData['TABS']['BINAURAL_20_HZ'],
              path: 'assets/sons/binaural/mp3/som-binaural-20-hz.webm',
              pathImage: 'assets/sons/binaural/imgs/binaural.gif',
              porcentagemProgresso: '',
              totalSoundDuration: '',
              categoria: 'SONS_BINAURAIS',
              labelCategoria: this.accessi18nData['TABS']['SONS_BINAURAIS'],
              soundValue: 'som-binaural-20-hz',
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

      return this.selectedSound[0];

  }


}
