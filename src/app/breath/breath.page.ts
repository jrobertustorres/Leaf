import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TranslateConfigService } from '../services/translate-config.service';
import { HttpClient } from '@angular/common/http';
import { EventService } from '../../utilitarios/EventService';

import { Howl } from 'howler';
import { Insomnia } from '@ionic-native/insomnia/ngx';

@Component({
  selector: 'app-breath',
  templateUrl: './breath.page.html',
  styleUrls: ['./breath.page.scss'],
})
export class BreathPage implements OnInit {
  accessi18nData: any;
  labelBreathe: string;
  breath: string;
  interval;
  timeOut;
  player: Howl = null;
  play: boolean;
  playAnimation: boolean = false;
  playCountdown: boolean = false;
  breathSound: any;
  grow: boolean;

  maxTime: any = 3;
  hidevalue: boolean;
  timer: any;

  breatheTime: number;
  holdTime: number;

  counter: number;


  @ViewChild('container', { read: ElementRef }) private container: ElementRef;
  constructor(public modalCtrl: ModalController,
              private http: HttpClient,
              private eventService: EventService,
              private insomnia: Insomnia) { 
      this.accessi18nData = JSON.parse(localStorage.getItem('I18N_DICTIONARY'));;
      // this.breath = this.accessi18nData['BREATH']['FOQUE_RESPIRACAO'];
    }
    
  ngOnInit() {
    this.breathSound = JSON.parse(localStorage.getItem('PATH_SOUND'));
    this.setSound();
  }
  
  ionViewWillEnter() {
    this.keepAwake();
  }
  
  ionViewWillLeave() {
    this.allowSleepAgain();
    this.verificaStatusPlayer();
  }
  
  keepAwake() {
    this.insomnia.keepAwake()
    .then(
      () => console.log('success'),
      () => console.log('error')
    );
  }

  allowSleepAgain() {
    this.insomnia.allowSleepAgain()
    .then(
      () => console.log('success'),
      () => console.log('error')
    );
  }

  setSound() {
    for(let i = 0; i < this.breathSound.length; i++) {
      if (this.breathSound[i]['name'] == 'nirvana-meditation'){
        this.breathSound = 'https://repositoriocalm.s3.amazonaws.com/mp3/nirvana-meditation.webm';
      }
    }
  }

  closeModal() {
    this.verificaStatusPlayer();
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  verificaStatusPlayer() {
    if(this.player) {
      this.player.stop();
      this.player.unload();
    }
  }

  toggleCountdown() {
    this.startCountdown(3);
  }


  startAnimation() {
    this.playAnimation = true;
    this.breathAnimation();
    this.startSound();
  }
      
  stopAnimation() {
    this.playAnimation = false;
    this.labelBreathe = '';
    clearInterval(this.interval);
    clearTimeout(this.timeOut);
    this.stopSound();
  }

  breathAnimation() {
    this.labelBreathe = '';

    let totalTime = 7500;
    this.breatheTime = (totalTime / 5) * 2;
    this.holdTime = totalTime / 5;

    this.labelBreathe = this.accessi18nData['BREATH']['INSPIRE'];
    this.grow = true;
    
    this.timeOut = setTimeout(() => {
      this.labelBreathe = this.accessi18nData['BREATH']['SEGURE'];
      this.timeOut = setTimeout(() => {
        this.labelBreathe = this.accessi18nData['BREATH']['EXPIRE'];
        this.grow = false;
      }, this.holdTime);
    }, this.breatheTime);

    this.interval = setInterval(() => {
      clearInterval(this.interval);
      this.breathAnimation();
    },totalTime);

  }

  startCountdown(seconds) {
    this.counter = seconds;
      
    const interval = setInterval(() => {
      this.counter--;
        
      if (this.counter < 1 ) {
        clearInterval(interval);
        this.startAnimation();
      }
    }, 1000);
  }

  setStateSound() {
    this.play = !this.play;
    if(!this.play) {
      this.stopSound();
    } else {
      this.startSound();
    }
  }

  startSound() {
    if(this.player) {
      this.player.stop();
      this.player.unload();
    }

    this.player = new Howl({
      src: this.breathSound,
      html5: true,
      loop: true,
      onload: () => {
      },
      onplay: () => {
        this.play = true;
      },
      onend: () => {
      }
    });
    this.player.play();
  }

  stopSound() {
    if(this.player) {
      this.player.stop();
      this.player.unload();
    }
  }

}
