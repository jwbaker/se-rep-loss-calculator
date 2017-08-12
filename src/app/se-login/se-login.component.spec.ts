import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeLoginComponent } from './se-login.component';

describe('SeLoginComponent', () => {
  let component: SeLoginComponent;
  let fixture: ComponentFixture<SeLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
