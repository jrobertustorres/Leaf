import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { TranslateConfigService } from '../services/translate-config.service';

@Component({
  selector: 'app-para-voce',
  templateUrl: './para-voce.page.html',
  styleUrls: ['./para-voce.page.scss'],
})
export class ParaVocePage implements OnInit {
  selectedLanguage: string;
  constructor(private iab: InAppBrowser,
              private translateConfigService: TranslateConfigService) { 
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.selectedLanguage = this.translateConfigService.getDefaultLanguage();
  }

  openEquilibrio(){
    this.iab.create('http://bit.ly/3cIxH6b', '_system', 'location=yes');
  }
  
  openIoga(){
    this.iab.create('http://bit.ly/36AYttt', '_system', 'location=yes');
  }
  
  openHooponopono() {
    this.iab.create('https://9ef775zlmz2e7g2508nk7l2l6b.hop.clickbank.net/', '_system', 'location=yes');
  }

}
