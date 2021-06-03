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
  private accessi18nData: any;

  pathSound: Object = [];

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

    if(this.player) {
      this.player.stop();
      this.player.unload();
    }
    this.player = new Howl({
      src: [track.path],
      html5: true,
      loop: null,
      // loop: this.isLooping,
      onload: () => {
        // this.totalSoundDuration = this.formatTime(Math.round(this.player.duration()));
      },
      onplay: () => {
        this.totalSoundDuration = this.formatTime(Math.round(this.player.duration()));
        this.selectedSound[0]['totalSoundDuration'] = this.totalSoundDuration;
        this.isPlaying = true;
        this.activeTrack = track;
        // localStorage.setItem('STATUS_PLAYER', this.isPlaying.toString()); // não me lembro por que coloquei essa linha, mas tive que comentá-la
        // estava influenciando no som da Home
        this.updateProgress();
      },
      onend: () => {
        this.activeTrack = track;
        this.isPlaying = false;
        let isLooping = JSON.parse(localStorage.getItem('IS_LOOPING'));
        if(isLooping == true) {
          this.start(this.selectedSound[0]);
        } else {
          this.player.stop();
        }
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

  public getJsonFile() {
    try {
      return new Promise((resolve, reject) => {
        // this.http.get('assets/sons.json')
        this.http.get('https://repositoriocalm.s3.amazonaws.com/sons.json')
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

  getMusic(soundValue: string) {
    this.pathSound = JSON.parse(localStorage.getItem('PATH_SOUND'));

    for(let i in this.pathSound) {
      if(this.pathSound[i]['soundValue'] == soundValue) {
        this.start(this.pathSound[i]);
        this.selectedSound[0] = this.pathSound[i];
        return this.selectedSound[0];
      }
    };

  }

}
