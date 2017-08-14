import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { DateRange } from "../models/date-range";

@Component({
  selector: 'app-se-range-picker',
  templateUrl: './se-range-picker.component.html',
  styleUrls: ['./se-range-picker.component.css']
})
export class SeRangePickerComponent implements OnChanges {

  @Input() min: Date;
  @Input() max: Date;
  @Output() onRangeChosen = new EventEmitter<DateRange>();

  private dates = new DateRange(null, null);
  private times = new DateRange(null, null);

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
      this.dates.start = this.min;
      this.times.start = this.min;
      this.dates.end = this.max;
      this.times.end = this.max;
  }

  private setDate(key:string, newDate: Date){
    this.dates[key] = new Date(
      newDate.getFullYear(),
      newDate.getMonth(),
      newDate.getDate()
    );
    this.emitDateRange();
  }

  private setTime(key:string, newTime:Date){
    this.times[key] = new Date(
      0, 0, 0,
      newTime.getHours(),
      newTime.getMinutes(),
      newTime.getSeconds()
    );
    this.emitDateRange();
  }

  private emitDateRange(){
    console.log('hi');
    let unifiedStartDate = new Date(
      this.dates.start.getFullYear(),
      this.dates.start.getMonth(),
      this.dates.start.getDate(),
      this.dates.start.getHours(),
      this.dates.start.getMinutes(),
      this.dates.start.getSeconds()
    );
    let unifiedEndDate = new Date(
      this.dates.end.getFullYear(),
      this.dates.end.getMonth(),
      this.dates.end.getDate(),
      this.dates.end.getHours(),
      this.dates.end.getMinutes(),
      this.dates.end.getSeconds()
    );
    this.onRangeChosen.emit(new DateRange(unifiedStartDate, unifiedEndDate));
  }
}
