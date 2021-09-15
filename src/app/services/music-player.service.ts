import { Injectable, Input, ViewChild } from '@angular/core';
import { IonRange } from '@ionic/angular';
import { Howl } from 'howler';
import { EventService } from '../../utilitarios/EventService';
import { TranslateConfigService } from '../services/translate-config.service';
import { HttpClient } from '@angular/common/http';

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
  categoriaRadio: string = '';
  categoria: string = '';
  albumValue: string = '';
  albumValueAntigo: string = '';
  playingRadio: boolean;
  private accessi18nData: any;
  
  private _count = 0;
  posicao: number = 0;

  novaPlayList: boolean = true;
  
  pathSound: Object = [];
  // pathSoundList: Object = [];
  pathSoundList: Array<string> = [];

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
              private http: HttpClient,
              private eventService: EventService) {
  }
  
  ngOnInit() {
 }

 ionViewDidLoad(){
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
    track = this.categoria != 'MUSICA' ? track : track[this.posicao];

    if(this.player) {
      this.player.stop();
      this.player.unload();
    }
    this.player = new Howl({
      src: [track.path],
      html5: true,
      loop: null,
      state: '',
      onload: () => {
        // this.totalSoundDuration = this.formatTime(Math.round(this.player.duration()));
      },
      onplay: () => {
        this.isPlaying = true;
        this.activeTrack = track;

        this.totalSoundDuration = this.formatTime(Math.round(this.player.duration()));
        // não me lembro por que coloquei essa linha abaixo(localStorage), mas tive que comentá-la
        // estava influenciando no som da Home
        // localStorage.setItem('STATUS_PLAYER', this.isPlaying.toString()); 

        this.selectedSound[this.posicao]['totalSoundDuration'] = this.totalSoundDuration;
        this.selectedSound[this.posicao]['state'] = this.player.state();
        // if(this.categoria === 'RADIO') {
        //   this.selectedSound[this.posicao]['playingRadio'] = true;
        // }

        /** atualiza o player minimizado na tela tabs.page e a tela now-playing*/
        this.eventService.publishData({
          activeTrack: this.selectedSound[this.posicao]// Antes era sempre zero
        });
        
        if(this.categoria === 'MUSICA') {
          this.showPlaylist();
        }

        // esta linha serve também para atualizar o botão de play/pause/stop em tempo real
        // this.updateProgress(); // esta linha não é mais necessário pois o seek está comentado
        this.updateButtonPlayer();

      },
      onend: () => {
        this.activeTrack = track;
        this.isPlaying = false;
        let isLooping = JSON.parse(localStorage.getItem('IS_LOOPING'));
        if(isLooping == true && this.categoria != 'MUSICA') {
          this.start(this.selectedSound[0]);
        } else {
          this.player.stop();
        }
        if(this.categoria === 'MUSICA') {
          let resultadoPosicao = ((this.posicao + 1) == this.pathSoundList.length) ? 0 : (this.posicao + 1);
          if(resultadoPosicao == 0 && isLooping == false) {
            this.stopPlayer();
            this.posicao = 0;
          } else {
            this.executePlayList(resultadoPosicao, this.pathSoundList);
          }
        }
      }
    });
    this.player.play();
  }

  showPlaylist() {
    this.eventService.showPlaylist({
      playListToShow: this.pathSoundList
    });
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
    /** atualiza o BOTÃO do player */
    this.eventService.publishUpdateButtonPlayer({
      buttonPlayerIsPlaying: this.isPlaying
    });
    
    return this.isPlaying;
  }

  setStatusLoop(looping: boolean) {
    this.isLooping = !looping;
    localStorage.setItem('IS_LOOPING', this.isLooping.toString());
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

  executeLoop() {
    this.start(this.selectedSound[0]);
  }
    
  updateButtonPlayer() {
    try {
      this.selectedSound[this.posicao]['isPlaying'] = this.isPlaying;

      if(!this.isPlaying) {
        this.selectedSound[this.posicao]['isPlaying'] = false;
      }

      /** atualiza o BOTÃO do player */
      this.eventService.publishUpdateButtonPlayer({
        buttonPlayerIsPlaying: this.isPlaying
      });
    }
    catch (err){
      if(err instanceof RangeError){
      }
    }
  }

  updateProgress() {
    try {
      let seek = this.player.seek();
      this.progress = (seek / this.player.duration()) * 100 || 0;

      // atualiza a barra de progresso quando o player está minimizado
      this.selectedSound[this.posicao]['porcentagemProgresso'] = this.progress < 10 ? '0.0'+this.progress : '0.'+this.progress.toFixed(0);
      this.selectedSound[this.posicao]['isPlaying'] = this.isPlaying;
      // this.selectedSound[0]['porcentagemProgresso'] = this.progress < 10 ? '0.0'+this.progress : '0.'+this.progress.toFixed(0);
      // this.selectedSound[0]['isPlaying'] = this.isPlaying;

      if(!this.isPlaying) {
        this.selectedSound[this.posicao]['isPlaying'] = false;
      }

        /** atualiza o player minimizado na tela tabs.page */
        this.eventService.publishData({
          activeTrack: this.selectedSound[this.posicao]// Antes era sempre zero
          // activeTrack: this.selectedSound[0]// Antes era sempre zero
        });

      this.eventService.publishPorcentagemProgresso({
        porcentagemProgresso: this.selectedSound[this.posicao]['porcentagemProgresso']
      });
      // tenho que ficar verificando em tempo real para manter a sincronia entre os botões de play, pause e stop do mini player e now-playing
      // setTimeout(() => {
      //   this.updateProgress();
      // }, 100);
      
      return this.progress;
    }
    catch (err){
      if(err instanceof RangeError){
        console.log('ERROR RangeError');
      }
      console.log(err);
    }
  }

  getMusic(soundValue: string, categoria: string) {
    // this.playingRadio = false;
    this.categoria = categoria;
    this.posicao = 0;
    this.pathSound = JSON.parse(localStorage.getItem('PATH_SOUND'));
    for(let i in this.pathSound) {
      this.pathSound[i]['playingRadio'] = false;
      if(this.pathSound[i]['soundValue'] == soundValue) {
        this.start(this.pathSound[i]);
        this.selectedSound[0] = this.pathSound[i];
        return this.selectedSound[0];
      }
    };
  }

  getPlayList(categoria: any, albumValue: string) {
    // this.playingRadio = false;
    this.categoria = categoria;
    let song_array = [];
    this.pathSoundList = JSON.parse(localStorage.getItem('PATH_SOUND'));
    for(let i in this.pathSoundList) {
      this.pathSoundList[i]['playingRadio'] = false;
      if(this.pathSoundList[i]['categoria'] == categoria && this.pathSoundList[i]['albumValue'] == albumValue) {
        song_array.push(this.pathSoundList[i]);
      }
    }
    this.pathSoundList = song_array;
    this.executePlayList(0, this.pathSoundList);
  }

  getRadio(nameRadio: string, categoria: string) {
    // this.playingRadio = true;
    this.categoria = categoria;
    this.posicao = 0;
    this.pathSound = JSON.parse(localStorage.getItem('PATH_RADIOS'));
    for(let i in this.pathSound) {
      this.pathSound[i]['playingRadio'] = true;
      if(this.pathSound[i]['nameRadio'] == nameRadio) {
        this.start(this.pathSound[i]);
        this.selectedSound[0] = this.pathSound[i];
        return this.selectedSound[0];
      }
    }
  }

  executePlayList(posicao,pathSoundList) {
    this.posicao = posicao;
    this.selectedSound[posicao] = pathSoundList[posicao];
    this.start(pathSoundList);
  }

  public getJsonFile() {
    try {
      return new Promise((resolve, reject) => {
        this.http.get('assets/sons.json')
        // this.http.get('https://repositoriocalm.s3.amazonaws.com/sons.json')
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
      });
    } catch (e){
      if(e instanceof RangeError){
        console.log('out of range');
      }
    }
  }

  public getJsonRadioFile() {
    try {
      return new Promise((resolve, reject) => {
        // this.http.get('assets/radios.json')
        this.http.get('https://repositoriocalm.s3.amazonaws.com/radios.json')
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
      });
    } catch (e){
      if(e instanceof RangeError){
        console.log('out of range');
      }
    }
  }

}
