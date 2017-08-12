import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertableComponent } from './alertable.component';

describe('AlertableComponent', () => {
  let component: AlertableComponent;
  let fixture: ComponentFixture<AlertableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
