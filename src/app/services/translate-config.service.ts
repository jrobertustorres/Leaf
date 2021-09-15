import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TranslateConfigService {
  public languageEvent: string;
  public accessi18nData: any;

  pathLanguage: Object = [];

  constructor(
    public translate: TranslateService,
    public http: HttpClient
  ) { }

  // getDefaultLanguage(){
  //   let language = this.translate.getBrowserLang();
  //   this.translate.setDefaultLang(language);
  //   return language;
  // }

  getDefaultLanguage(){
    let language: string = '';

    if(localStorage.getItem('IDIOMA_USUARIO') != null && localStorage.getItem('IDIOMA_USUARIO') != '') {
      language = localStorage.getItem('IDIOMA_USUARIO');
    } else {
      language = this.translate.getBrowserLang();
      if(language != 'en' && language != 'pt') {
        language = 'en';
      }
    }
    this.translate.setDefaultLang(language);
    return language;
  }

  setLanguage(setLang: string) {
    this.languageEvent = setLang;
    localStorage.setItem('IDIOMA_USUARIO', this.languageEvent);
    this.translate.use(this.languageEvent);
  }

  public getI18nData(languageEvent: string) {
    try {
      return new Promise((resolve, reject) => {
        this.http.get('https://repositoriocalm.s3.amazonaws.com/i18n/'+languageEvent+'.json')
        .subscribe(data => {
          console.log(data);
          resolve(data);
        }, (err) => {
          reject(err);
        });
      });
    } catch (e){
      if(e instanceof RangeError){
        console.log('out of range');
      }
    }
  }

  // getI18nData2() {
  //   this.http.get('https://repositoriocalm.s3.amazonaws.com/i18n/'+this.languageEvent+'.json').subscribe(data => {
  //     this.accessi18nData = data;
  //     localStorage.setItem('PATH_LANGUAGE', JSON.stringify(this.pathLanguage));
  //     return this.accessi18nData;
  //   });

  //   // this.http.get('assets/i18n/'+this.languageEvent+'.json').subscribe(data => {
  //   //   this.accessi18nData = data;
  //   //   return this.accessi18nData;
  //   // });
  // }

  // getTranslate() {
  //     if (this.languageEvent == 'pt') {
  //         return this.http.get('assets/i18n/pt.json');
  //     } else if (this.languageEvent == 'en'){
  //         return this.http.get('assets/i18n/en.json');
  //     }
  // }

}