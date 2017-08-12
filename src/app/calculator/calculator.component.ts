import { Component } from '@angular/core';
import { AlertData, AlertManagerService } from '../alert-manager.service';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent {

  alerts: AlertData[] = [];

  constructor(private alertManager: AlertManagerService) { 
    alertManager.alertRaised$.subscribe(alert => {
      this.alerts.push(alert)
    });
  }

  api_data = {
    networkUsers: [],
    accessToken: '',
    site: ''
  };

  wizard_status = {
    logged_in: false,
    site_chosen: false
  };

  private onLogIn(event){
    this.wizard_status.logged_in = true;
    this.api_data.networkUsers = event.networkUsers;
    this.api_data.accessToken = event.accessToken;
  }

  private onSiteChosen(event: string){
    this.wizard_status.site_chosen = event.length > 0;
    this.api_data.site = event;
  }

}
