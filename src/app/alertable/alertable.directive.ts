import { Directive } from '@angular/core';
import { AlertManagerService } from '../alert-manager.service';
import { Subscription } from 'rxjs/Subscription';

@Directive({
  selector: 'app-alertable'
})
export class AlertableDirective {

  constructor(protected alertManager: AlertManagerService) {}

  protected raise(type, message, properties) {
    this.alertManager.raise(type, message, properties);
  }
}
