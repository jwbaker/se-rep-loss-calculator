import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

export class AlertData {
  type: any;
  message: string;
  properties: Object;
};

@Injectable()
export class AlertManagerService {
  private alertSource = new Subject<AlertData>();

  alertRaised$ = this.alertSource.asObservable();

  raise(type: any, message: string, properties: Object){
    this.alertSource.next({type, message, properties});
  }
}
