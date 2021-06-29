import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RadiosPage } from './radios.page';

describe('RadiosPage', () => {
  let component: RadiosPage;
  let fixture: ComponentFixture<RadiosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadiosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RadiosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
