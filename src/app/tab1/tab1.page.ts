import { Component, ViewChild } from '@angular/core';
import { interval } from 'rxjs';

import { TranslateConfigService } from '../services/translate-config.service';
import { HttpClient } from '@angular/common/http';
import { EventService } from '../../utilitarios/EventService';

import { AdmobService } from '../services/admob.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
   
  // agora: number;
  // mesAtual: string;
  // backgroundImage: string = '';
  // dia: boolean = true;
  saudacao: string = '';

  selectedLanguage: string;
  private accessi18nData: any;

  arrayFrase: string;
  fraseHoje: string;
  autorHoje: string;

  constructor(private translateConfigService: TranslateConfigService,
              private httpC: HttpClient,
              private admobService: AdmobService,
              private eventService: EventService) {
    this.selectedLanguage = this.translateConfigService.getDefaultLanguage();
    this.getChangeLanguage();
  }

  getChangeLanguage() {
    this.eventService.getObservableChangeLanguage().subscribe((data) => {
      this.selectedLanguage = data.selectedLanguage;
      this.httpC.get('assets/i18n/'+this.selectedLanguage+'.json').subscribe(data => {
        this.accessi18nData = data;
        // seleciona a frase do dia
        let arrayHoje = localStorage.getItem('ARRAY_HOJE');
        
        for(let i in this.accessi18nData['FRASES']){
          if(JSON.parse(arrayHoje)[0]['ID'] == this.accessi18nData['FRASES'][i]['ID']) {
            let frase = [this.accessi18nData['FRASES'][i]];
            this.fraseHoje = this.accessi18nData['FRASES'][i]['FRASE'];
            this.autorHoje = this.accessi18nData['FRASES'][i]['AUTOR'];
            localStorage.setItem('ARRAY_HOJE', JSON.stringify(frase));
          }
        }

      });
    });
  }
  
  ngOnInit() {
    this.Interstitial();

    // interval(10 * 60).subscribe(x => {
    //   // this.getTime();
    //   // this.getDate();
    // this.changeBackground();      
    // });

    // localStorage.removeItem('DIA_DA_SEMANA');
    // localStorage.removeItem('FRASE_HOJE');

    if((new Date()).getDay().toString() != localStorage.getItem('DIA_DA_SEMANA')) {
      this.frases();
    } else {
      this.arrayFrase = localStorage.getItem('ARRAY_HOJE');
      this.fraseHoje = JSON.parse(this.arrayFrase)[0]['FRASE'];
      this.autorHoje = JSON.parse(this.arrayFrase)[0]['AUTOR'];
    }
  }

  //FUNCTION FOR INTERSTITIAL
  Interstitial(){
    this.admobService.ShowInterstitial();
  }
  // FUNCTION FOR VIDEOREWARD
  Reward(){
    this.admobService.ShowRewardVideo();
  }

  

  frases() {

    this.httpC.get('assets/i18n/'+this.selectedLanguage+'.json').subscribe(data => {
      this.accessi18nData = data;

      let rd = Math.floor(Math.random() * this.accessi18nData['FRASES'].length);
      let frase = [this.accessi18nData['FRASES'][rd]];

      this.fraseHoje = frase[0]['FRASE'];
      this.autorHoje = frase[0]['AUTOR'];
      localStorage.setItem('ARRAY_HOJE', JSON.stringify(frase));
      localStorage.setItem('DIA_DA_SEMANA', (new Date()).getDay().toString());
    });
    
  }

  // getTime() {
  //   this.agora = Date.now();
  // }
  
  // getDate() {
  //   let nomeMeses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];// colocar aqui para pegar a tradução
  //   this.mesAtual = nomeMeses[(new Date()).getMonth()];
  // }

  // changeBackground() {
  //   // if(new Date().getHours() >= 6 && new Date().getHours() < 18) {
  //   if(new Date().getHours() >= 6 && new Date().getHours() < 12) {
      
  //   } else if(new Date().getHours() >= 12 && new Date().getHours() < 18) {
  //     // this.backgroundImage = 'https://media.giphy.com/media/dMAg2noNzwWmQ/giphy.gif'; // praia
  //   } else {
  //     // this.backgroundImage = 'https://media.giphy.com/media/kkNme30oTB5Wo/giphy.gif'; // fogueira de noite na praia
  //   }
  // }

}
