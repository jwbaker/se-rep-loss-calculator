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
    
  };

  wizard_status = {
    logged_in: false
  };

}
