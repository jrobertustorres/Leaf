import { Component, ViewChild } from '@angular/core';
import { interval } from 'rxjs';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
   
  agora: number;
  mesAtual: string;
  backgroundImage: string = '';
  dia: boolean = true;
  // backgroundImage: string = '/assets/imgs/home-day.jpg';

  constructor() {
    // this.getTime();
    // this.getDate();
  }
  
  ngOnInit() {
    interval(10 * 60).subscribe(x => {
      // this.getTime();
      // this.getDate();
      this.changeBackground();      
    });
  }

  // getTime() {
  //   this.agora = Date.now();
  // }
  
  // getDate() {
  //   let nomeMeses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];// colocar aqui para pegar a tradução
  //   this.mesAtual = nomeMeses[(new Date()).getMonth()];
  // }

  changeBackground() {
    if(new Date().getHours() >= 6 && new Date().getHours() < 18) {
      this.dia = true;
      this.backgroundImage = 'https://media.giphy.com/media/dMAg2noNzwWmQ/giphy.gif'; // praia
    } else {
      this.dia = false;
      this.backgroundImage = 'https://media.giphy.com/media/kkNme30oTB5Wo/giphy.gif'; // fogueira de noite na praia
    }
    // if(new Date().getHours() >= 18) {
    //   // if(new Date().getMinutes() == 36) {
    //     this.dia = false;
    //     this.backgroundImage = 'https://media.giphy.com/media/kkNme30oTB5Wo/giphy.gif'; // fogueira de noite na praia
    //     // this.backgroundImage = 'https://media.giphy.com/media/SzUtv3rO40xhu/giphy.gif'; // noite/tarde no lago
    //     // this.backgroundImage = '/assets/imgs/home-day.jpg';
    //   } else {
    //     this.dia = true;
    //     this.backgroundImage = 'https://media.giphy.com/media/dMAg2noNzwWmQ/giphy.gif'; // praia
    //     // this.backgroundImage = 'https://media.giphy.com/media/KWgrae4lheUla/giphy.gif'; // cachoeira na montanha
    //     // this.backgroundImage = 'https://media.giphy.com/media/12qHWnTUBzLWXS/giphy.gif'; // água nas pedras da montanha
        
    //   }
  }
}
