import { Injectable } from '@angular/core';
declare var SE:any; // need to define the global SE object provided by the SDK

@Injectable()
export class StackExchangeService {
  private initPromise: Promise<boolean>;

  constructor() {
    this.initPromise = new Promise((resolve, reject) => {
      SE.init({
        clientId: 6388,
        key: 'LatL0Qaw3)dPKFoK6Y1yiQ((',
        channelUrl: 'http://localhost/blank',
        complete: function(data){
          resolve();
        }
      });
   });
  }

  public logIn() {
    const self = this;
    return new Promise<Object>((resolve, reject) => {
      self.initPromise.then(() => {
        SE.authenticate({
          scope: ['private_info'],
          networkUsers: true,
          success: resolve,
          error: reject
        });
      });
    });
  }
}
