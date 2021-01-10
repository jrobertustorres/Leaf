import { Component, OnInit } from '@angular/core';
// Receive Parameter
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sons-list',
  templateUrl: './sons-list.page.html',
  styleUrls: ['./sons-list.page.scss'],
})
export class SonsListPage implements OnInit {

  categoria: any;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    console.log('====> ', this.categoria);
  }
  

}
