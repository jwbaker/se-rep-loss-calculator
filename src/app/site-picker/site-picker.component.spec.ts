import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SitePickerComponent } from './site-picker.component';

describe('SitePickerComponent', () => {
  let component: SitePickerComponent;
  let fixture: ComponentFixture<SitePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SitePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SitePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
