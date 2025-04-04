import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientencounterComponent } from './clientencounter.component';

describe('ClientencounterComponent', () => {
  let component: ClientencounterComponent;
  let fixture: ComponentFixture<ClientencounterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientencounterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientencounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
