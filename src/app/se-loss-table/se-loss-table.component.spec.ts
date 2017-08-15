import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeLossTableComponent } from './se-loss-table.component';

describe('SeLossTableComponent', () => {
  let component: SeLossTableComponent;
  let fixture: ComponentFixture<SeLossTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeLossTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeLossTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
