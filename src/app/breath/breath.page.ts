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
  // selectedLanguage: string;
  accessi18nData: any;
  breath = {};

  labelBreathe: string;

  maxTime: number = 0;
  timer;
  interval;
  time: number;

  isPlaying: boolean = false;

  player: Howl = null;
  play: boolean;
  sound: any;
  breathSound: any;
  
  @ViewChild('el') element: ElementRef
  constructor(public modalCtrl: ModalController,
              private http: HttpClient,
              private eventService: EventService,
              private renderer: Renderer2) { 
      this.accessi18nData = JSON.parse(localStorage.getItem('I18N_DICTIONARY'));;
      this.breath = this.accessi18nData['BREATH']['FOQUE_RESPIRACAO'];
  }

  ngOnInit() {
    this.breathSound = JSON.parse(localStorage.getItem('PATH_SOUND'));
    this.breathSound = this.breathSound[12]['MEDITATION']['NIRVANA-MEDITATION']['path']; //nirvana-meditation
    this.startSound();
  }
  
  ionViewWillEnter() {
  }

  closeModal() {
    this.verificaStatusPlayer();
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  verificaStatusPlayer() {
    this.player.stop();
    this.player.unload();
  }

  togglePlayer() {
    this.isPlaying = !this.isPlaying;
    if(this.isPlaying) {
      this.startAnimation();
    } else {
      this.stopAnimation();
    }
  }

  startAnimation() {
    this.labelBreathe = this.accessi18nData['BREATH']['INSPIRE'];
    this.time = 0;
    this.renderer.addClass(this.element.nativeElement, 'anim-circle');
    this.startTimer();
  }
  
  stopAnimation() {
    this.labelBreathe = '';
    this.time = 0;
    this.renderer.removeClass(this.element.nativeElement, 'anim-circle');
    clearInterval(this.interval);
  }

  startTimer() {
    this.interval = setInterval(() => {
      if(this.time == 5) {
          this.labelBreathe = this.accessi18nData['BREATH']['EXPIRE'];
      }
      if(this.time == 10) {
        this.labelBreathe = this.accessi18nData['BREATH']['INSPIRE'];
        this.time = 0;
      }
      this.time += 1;
    },1000);
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
