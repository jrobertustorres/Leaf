import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TranslateConfigService {
  public languageEvent: string;
  public accessi18nData: any;

  constructor(
    public translate: TranslateService,
    public http: HttpClient
  ) { }

  getDefaultLanguage(){
    let language: string = '';
    if(localStorage.getItem('IDIOMA_USUARIO')) {
      language = localStorage.getItem('IDIOMA_USUARIO');
    } else {
      language = this.translate.getBrowserLang();
    }
    this.translate.setDefaultLang(language);
    return language;
  }

  setLanguage(setLang: string) {
    this.languageEvent = setLang;
    localStorage.setItem('IDIOMA_USUARIO', this.languageEvent);
    this.translate.use(this.languageEvent);
  }

  getI18nData() {
    this.http.get('assets/i18n/'+this.languageEvent+'.json').subscribe(data => {
      this.accessi18nData = data;
      localStorage.setItem('I18N_DATA', this.accessi18nData);
      // return this.accessi18nData;
    });
  }

  getTranslate() {
      if (this.languageEvent == 'pt') {
          return this.http.get('assets/i18n/pt.json');
      } else if (this.languageEvent == 'en'){
          return this.http.get('assets/i18n/en.json');
      }
  }

}