import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DateRange } from "../models/date-range";
import { StackExchangeService } from "../stack-exchange.service";
import { SeReputationHistory } from "../models/se-reputation-history";
import { AlertableDirective } from "../alertable/alertable.directive";
import { AlertManagerService } from "../alert-manager.service";

@Component({
  selector: 'app-se-loss-table',
  templateUrl: './se-loss-table.component.html',
  styleUrls: ['./se-loss-table.component.css']
})
export class SeLossTableComponent extends AlertableDirective implements OnChanges {

  private messages = {
    'working': 'Working...'
  }

  @Input() userId:Number;
  @Input() site:String;
  @Input() accessToken:String;
  @Input() dateRange:DateRange;
  @Input() beginCalculation:boolean;

  private working = false;
  private message:string;
  private reputationEvents:SeReputationHistory[];

  constructor(private se:StackExchangeService, protected alertManager: AlertManagerService) { super(alertManager) }

  ngOnChanges(changes: SimpleChanges): void {
    const beginCalculationChanged = changes.beginCalculation;
    if(beginCalculationChanged && beginCalculationChanged.currentValue && beginCalculationChanged.currentValue !== beginCalculationChanged.previousValue){
      this.doCalculate();
    }
  }

  private doCalculate() {
    this.working = true;
    this.message = this.messages.working;
    this.reputationEvents = [];

    let subscription = this.se.getReputationHistory(this.userId, this.site, this.accessToken, this.dateRange).subscribe({
      next: event => this.reputationEvents.push(event),
      error: message => {
        this.raise("danger", message, {});
        subscription.unsubscribe();
        this.working = false;
      },
      complete: () => {
        console.log(this.reputationEvents);
        this.working = false;
      }
    });
  }

}
