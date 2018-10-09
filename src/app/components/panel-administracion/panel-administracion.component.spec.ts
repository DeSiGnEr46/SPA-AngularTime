import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelAdministracionComponent } from './panel-administracion.component';

describe('PanelAdministracionComponent', () => {
  let component: PanelAdministracionComponent;
  let fixture: ComponentFixture<PanelAdministracionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelAdministracionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelAdministracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
