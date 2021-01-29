import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TranslateConfigService } from '../services/translate-config.service';
import { HttpClient } from '@angular/common/http';
import { EventService } from '../../utilitarios/EventService';

@Component({
  selector: 'app-breath',
  templateUrl: './breath.page.html',
  styleUrls: ['./breath.page.scss'],
})
export class BreathPage implements OnInit {
  selectedLanguage: string;
  accessi18nData: any;
  breath = {};

  constructor(public modalCtrl: ModalController,
              private httpC: HttpClient,
              private eventService: EventService,
              private translateConfigService: TranslateConfigService) { 
    this.selectedLanguage = this.translateConfigService.getDefaultLanguage();

    this.httpC.get('assets/i18n/'+this.selectedLanguage+'.json').subscribe(data => {
      this.accessi18nData = data;
      this.breath = this.accessi18nData['BREATH'];
    });
    this.getChangeLanguage();
  }

  ngOnInit() {
  }

  closeModal() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  getChangeLanguage() {
    this.eventService.getObservableChangeLanguage().subscribe((data) => {
      this.selectedLanguage = data.selectedLanguage;
      this.httpC.get('assets/i18n/'+this.selectedLanguage+'.json').subscribe(data => {
        this.accessi18nData = data;
        this.breath = this.accessi18nData['BREATH'];
      });
    });
  }

}
