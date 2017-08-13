import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeRangePickerComponent } from './se-range-picker.component';

describe('SeRangePickerComponent', () => {
  let component: SeRangePickerComponent;
  let fixture: ComponentFixture<SeRangePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeRangePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeRangePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
