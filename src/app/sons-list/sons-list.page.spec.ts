import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SonsListPage } from './sons-list.page';

describe('SonsListPage', () => {
  let component: SonsListPage;
  let fixture: ComponentFixture<SonsListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SonsListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SonsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
