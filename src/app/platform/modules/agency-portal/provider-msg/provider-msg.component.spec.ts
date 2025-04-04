import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderMsgComponent } from './provider-msg.component';

describe('ProviderMsgComponent', () => {
  let component: ProviderMsgComponent;
  let fixture: ComponentFixture<ProviderMsgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderMsgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderMsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
