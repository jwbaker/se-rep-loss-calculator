import { Component, Input, Output, EventEmitter } from '@angular/core';
import { StackExchangeService } from '../stack-exchange.service';
import { AlertableDirective } from '../alertable/alertable.directive';
import { AlertManagerService } from '../alert-manager.service'
import { SeLoggedInData } from "../models/se-logged-in-data";

@Component({
  selector: 'app-se-login',
  templateUrl: './se-login.component.html',
  styleUrls: ['./se-login.component.css']
})
export class SeLoginComponent extends AlertableDirective {
  loggedInValue = false;
  @Output() loggedInChange = new EventEmitter();
  private loggedInData: SeLoggedInData;

  constructor(private seService: StackExchangeService, protected alertManager: AlertManagerService) {
    super(alertManager);
  }

  @Input()
  get loggedIn() {
    return this.loggedInValue;
  }

  set loggedIn(value:boolean) {
    this.loggedInValue = value;
    this.loggedInChange.emit(this.loggedInValue);
  }

  doLogIn() {
    this.seService.logIn().then(data => {
      this.raise("success", "Login successful!", {});
      this.loggedIn = true;
      this.loggedInData = <SeLoggedInData>data;
    }).catch(data => {
      console.error(data);
    });
  }

}
