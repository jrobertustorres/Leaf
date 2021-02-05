import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-para-voce',
  templateUrl: './para-voce.page.html',
  styleUrls: ['./para-voce.page.scss'],
})
export class ParaVocePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  openEquilibrio(){
    window.open('http://bit.ly/3cIxH6b', '_system', 'location=yes');
  }

  openIoga(){
    window.open('http://bit.ly/36AYttt', '_system', 'location=yes');
  }

}
