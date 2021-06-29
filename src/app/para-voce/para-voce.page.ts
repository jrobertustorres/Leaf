import { Component, OnInit } from '@angular/core';
import { NavController } from "@ionic/angular";
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { TranslateConfigService } from '../services/translate-config.service';
import { Location } from "@angular/common";
import { AnimationOptions } from '@ionic/angular/providers/nav-controller';

@Component({
  selector: 'app-para-voce',
  templateUrl: './para-voce.page.html',
  styleUrls: ['./para-voce.page.scss'],
})
export class ParaVocePage implements OnInit {
  selectedLanguage: string;
  private _scrollDepthTriggered = false;
  
  constructor(private iab: InAppBrowser,
              private _location: Location,
              private navCtrl: NavController,
              private translateConfigService: TranslateConfigService) { 
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.selectedLanguage = this.translateConfigService.getDefaultLanguage();
  }

  myBackButton(){
    let animations:AnimationOptions={
      animated: true,
      animationDirection: "back"
    }
    this.navCtrl.back(animations);
  }

  // criar um service para essa função
  async logScrolling($event) {

    if($event.target.localName != "ion-content") {
      return;
    }

    const scrollElement = await $event.target.getScrollElement();
    // minus clientHeight because trigger is scrollTop
    // otherwise you hit the bottom of the page before 
    // the top screen can get to 80% total document height
    const scrollHeight = scrollElement.scrollHeight - scrollElement.clientHeight;
    const currentScrollDepth = $event.detail.scrollTop;
    // this.yourToggleFlag = currentScrollDepth < 413 ? true : false; 
    const targetPercent = 10;
    // const targetPercent = 20;
    let triggerDepth = ((scrollHeight / 100) * targetPercent);
    if(currentScrollDepth > triggerDepth) {
      // this ensures that the event only triggers once
      this._scrollDepthTriggered = true;
    }
    if(currentScrollDepth < triggerDepth) {
      // this ensures that the event only triggers once
      this._scrollDepthTriggered = false;
    }
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
