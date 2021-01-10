import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Howl } from 'howler';
import { IonRange } from '@ionic/angular';
import {
  NavController,
  LoadingController,
  Platform,
  ToastController
} from '@ionic/angular';
import { DatePipe } from '@angular/common';

import {
  FileTransfer,
  FileTransferObject
} from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { Media, MediaObject } from '@ionic-native/media/ngx';

export interface Track {
  name: string;
  path: string;
}

@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.page.html',
  styleUrls: ['./music-player.page.scss'],
})
export class MusicPlayerPage implements OnInit {

  playlist: Track[] = [
    {
      name: 'bensound hey',
      path: './../../assets/mp3/bensound-hey.mp3'
    },
    {
      name: 'bensound cute',
      path: './../../assets/mp3/bensound-cute.mp3'
    }
  ];

  activeTrack: Track = null;
  player: Howl = null;
  isPlaying = false;
  progress = 0;
  timePlayed = 0;
  totalSoundDuration = '';
  currentTime = '';
  @ViewChild('range', { static: false }) range: IonRange;

  constructor(public modalController: ModalController) { }

  ngOnInit() {
  }

  closeModal() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  start(track: Track) {

    if(this.player) {
      this.player.stop();
    }
    this.player = new Howl({
      src: [track.path],
      html5: true,
      onload: () => {
        let date = new Date(null);
        date.setSeconds(this.player.duration()); // specify value for SECONDS here
        this.totalSoundDuration = date.toISOString().substr(11, 8);
    },
      onplay: () => {
        this.isPlaying = true;
        this.activeTrack = track;
        this.updateProgress();
      },
      onend: () => {
        this.activeTrack = track;
      }
    });
    this.player.play();

  }

  togglePlayer(pause) {
    this.isPlaying = !pause;
    if(pause) {
      this.player.pause();
    } else {
      this.player.play();
    }
  }

  // next() {

  // }

  // prev() {

  // }

  seek() {
    let newValue = +this.range.value;
    let duration = this.player.duration();
    this.player.seed(duration * (newValue / 100));
  }
  
  updateProgress() {
    let seek = this.player.seek();
    this.progress = (seek / this.player.duration()) * 100 || 0;
    
    let date = new Date(null);
    date.setSeconds(seek); // specify value for SECONDS here
    this.currentTime = date.toISOString().substr(11, 8);
    
    setTimeout(() => {
      this.updateProgress();
    }, 1000)
  }
}






