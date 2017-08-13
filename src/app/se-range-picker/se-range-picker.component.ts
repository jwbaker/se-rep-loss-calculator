import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-se-range-picker',
  templateUrl: './se-range-picker.component.html',
  styleUrls: ['./se-range-picker.component.css']
})
export class SeRangePickerComponent implements OnChanges {

  @Input() min: Date;
  @Input() max: Date;
  @Output() onRangeChosen = new EventEmitter<Date[]>();

  private start: Date;
  private end: Date;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['min'].previousValue === undefined){
      this.start = this.min;
    }

    if(changes['max'].previousValue === undefined){
      this.end = this.max;
    }
  }

  private rangeChosen() {
    this.onRangeChosen.emit([this.start, this.end])
  }

}
