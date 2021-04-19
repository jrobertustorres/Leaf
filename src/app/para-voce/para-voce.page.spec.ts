import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ParaVocePage } from './para-voce.page';

describe('ParaVocePage', () => {
  let component: ParaVocePage;
  let fixture: ComponentFixture<ParaVocePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParaVocePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ParaVocePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
