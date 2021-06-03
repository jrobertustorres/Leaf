import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TranslateConfigService } from '../services/translate-config.service';
import { HttpClient } from '@angular/common/http';
import { EventService } from '../../utilitarios/EventService';

import { Howl } from 'howler';

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
              private renderer: Renderer2) { 
      this.accessi18nData = JSON.parse(localStorage.getItem('I18N_DICTIONARY'));;
      this.breath = this.accessi18nData['BREATH']['FOQUE_RESPIRACAO'];

    // this.startTimer();
    // this.breathAnimation();

    }
    
  ngOnInit() {
    this.breathSound = JSON.parse(localStorage.getItem('PATH_SOUND'));
    this.setSound();
  }
  
  ionViewWillEnter() {
  }

  setSound() {
    // this.eventService.publishCloseModal({
    //   buttonClicked: true
    // });
    for(let i = 0; i < this.breathSound.length; i++) {
      if (this.breathSound[i]['name'] == 'nirvana-meditation'){
        this.breathSound = 'https://repositoriocalm.s3.amazonaws.com/mp3/nirvana-meditation.webm';
      }
    }
    // this.startSound();
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

  // togglePlayer() {
  //   this.isPlaying = !this.isPlaying;
  //   if(this.isPlaying) {
  //     // this.breathAnimation();
  //     this.startAnimation();
  //   } else {
  //     this.stopAnimation();
  //   }
  // }

  toggleCountdown() {
    // this.playCountdown = !this.playCountdown;
    // if(this.playCountdown) {
      this.startCountdown(3);
    // }
  }


  startAnimation() {
    this.playAnimation = true;
    // if(this.playAnimation) {
      this.breathAnimation();
      this.startSound();
      // }else {
        //   this.stopAnimation();
        // }
      }
      
  stopAnimation() {
    this.playAnimation = false;
    this.labelBreathe = '';
    clearInterval(this.interval);
    clearTimeout(this.timeOut);
    this.stopSound();
  }
  // toggleAnimation() {
  //   this.playAnimation = !this.playAnimation;
  //   if(this.playAnimation) {
  //     this.breathAnimation();
  //     this.startSound();
  //   }else {
  //     this.stopAnimation();
  //   }
  // }

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
      console.log(this.counter);
      this.counter--;
        
      if (this.counter < 1 ) {
        clearInterval(interval);
        console.log('Ding!');
        this.startAnimation();
      }
    }, 1000);
    // this.breathAnimation();
  }

  // startTimer() {
  //   this.interval = setInterval(() => {
  //     if(this.time == 5) {
  //         this.labelBreathe = this.accessi18nData['BREATH']['EXPIRE'];
  //     }
  //     if(this.time == 10) {
  //       this.labelBreathe = this.accessi18nData['BREATH']['INSPIRE'];
  //       this.time = 0;
  //     }
  //     this.time += 1;
  //   },1000);
  // }
  
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
