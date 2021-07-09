import { Component, Input } from '@angular/core';
import { PopoverController } from "@ionic/angular";

@Component({
  selector: 'app-music-information',
  templateUrl: './music-information.component.html',
  styleUrls: ['./music-information.component.scss'],
})
export class MusicInformationComponent {
  @Input() playListToShow: string;
  private _accessi18nData: any;
  private _titulo = {};
  constructor (private popover: PopoverController) { 
    this._accessi18nData = JSON.parse(localStorage.getItem('I18N_DICTIONARY'));
    this._titulo = this._accessi18nData['TABS'];
  }
              
  ClosePopover() {
    this.popover.dismiss();
  }

}
