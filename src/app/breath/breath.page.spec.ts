import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BreathPage } from './breath.page';

describe('BreathPage', () => {
  let component: BreathPage;
  let fixture: ComponentFixture<BreathPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BreathPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BreathPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
