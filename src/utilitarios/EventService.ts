import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EventService {

    private fooSubject = new Subject<any>();
    private buttonClicked = new Subject<any>();
    private updateList = new Subject<any>();
    private languageChanged = new Subject<any>();
    private porcentagemProgresso = new Subject<any>();

    publishData(data: any) {
        this.fooSubject.next(data);
    }
    
    getObservable(): Subject<any> {
        return this.fooSubject;
    }

    publishPorcentagemProgresso(data: any) {
        this.porcentagemProgresso.next(data);
    }
    
    getPorcentagemProgresso(): Subject<any> {
        return this.porcentagemProgresso;
    }
    
    publishCloseModal(data: any) {
        this.buttonClicked.next(data);
    }
    getObservableCloseModal() {
        return this.buttonClicked;
    }

    publishMinimizedModal(data: any) {
        this.updateList.next(data);
    }
    updateFavoritosList() {
        return this.updateList;
    }

    publishChangeLanguage(data: any) {
        this.languageChanged.next(data);
    }

    getObservableChangeLanguage() {
        return this.languageChanged;
    }
}