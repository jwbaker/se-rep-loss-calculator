import { Component } from '@angular/core';
import { AlertData, AlertManagerService } from '../alert-manager.service';
import { DateRange } from '../models/date-range';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent {

  alerts: AlertData[] = [];

  private minDate: Date;
  private maxDate: Date;

  constructor(private alertManager: AlertManagerService) { 
    alertManager.alertRaised$.subscribe(alert => {
      this.alerts.push(alert)
    });
  }

  apiData = {
    networkUsers: [],
    accessToken: '',
    site: '',
    dateRange: {}
  };

  wizardStatus = {
    loggedIn: false,
    siteChosen: false,
    dateRangeChosen: true
  };

  private onLogIn(event){
    this.wizardStatus.loggedIn = true;
    this.apiData.networkUsers = event.networkUsers;
    this.apiData.accessToken = event.accessToken;
  }

  private onSiteChosen(event: string){
    this.wizardStatus.siteChosen = event.length > 0;
    this.apiData.site = event;
    this.maxDate = new Date();
    this.minDate = this.apiData.networkUsers.find((value, index, obj) => value.siteUrl.includes(event)).creationDate;
  }

  private onRangePicked(event:DateRange){
    this.apiData.dateRange = event;
    console.log(event);
  }

}
