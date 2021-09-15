import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EventService {

    private fooSubject = new Subject<any>();
    private buttonClicked = new Subject<any>();
    private buttonPlayerIsPlaying = new Subject<any>();
    private updateList = new Subject<any>();
    private updateFavorito = new Subject<any>();
    private languageChanged = new Subject<any>();
    private porcentagemProgresso = new Subject<any>();
    private playListToShow = new Subject<any>();

    publishData(data: any) {
        this.fooSubject.next(data);
    }
    
    getObservable(): Subject<any> {
        return this.fooSubject;
    }

    showPlaylist(data: any) {
        this.playListToShow.next(data);
    }
    
    getPlaylistToShow(): Subject<any> {
        return this.playListToShow;
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

    publishUpdateButtonPlayer(data: any) {
        this.buttonPlayerIsPlaying.next(data);
    }
    getObservableButtonPlayer() {
        return this.buttonPlayerIsPlaying;
    }

    publishUpdateFavoritosList(data: any) {
        this.updateList.next(data);
    }
    updateFavoritosList() {
        return this.updateList;
    }
    
    publishFavoritoNowPlaying(data: any) {
        this.updateFavorito.next(data);
    }
    updateFavoritoNowPlaying() {
        return this.updateFavorito;
    }

    publishChangeLanguage(data: any) {
        this.languageChanged.next(data);
    }

    getObservableChangeLanguage() {
        return this.languageChanged;
    }
}