import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { SeLoggedInData } from './models/se-logged-in-data';
import { DateRange } from "./models/date-range";
import { SeReputationHistory, SeReputationHistoryResponse } from './models/se-reputation-history'
import { Observable } from "rxjs";
import { SePostResponse, SePost } from "./models/se-post";
declare var SE: any; // need to define the global SE object provided by the SDK

interface SEResponseObject<T> {
  backoff?: number;
  error_id?: number;
  error_message?: string;
  has_more: boolean;
  items: T[];
}

@Injectable()
export class StackExchangeService {
  private initPromise: Promise<boolean>;
  private static apiKey = 'LatL0Qaw3)dPKFoK6Y1yiQ((';  

  constructor(private http: HttpClient) {
    this.initPromise = new Promise((resolve, reject) => {
      SE.init({
        clientId: 6388,
        key: StackExchangeService.apiKey,
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
          success: data => {
            resolve(new SeLoggedInData(data))
          },
          error: reject
        });
      });
    });
  }

  private getReputationEventsPage(route:String, params:String[], page:number){
    const localParams = params.concat(["page=" + page]);

    return this.http.get<SEResponseObject<SeReputationHistoryResponse>>(route + '?' + localParams.join('&'));
  }

  private getReputationEvents(route:String, params:String[], page:number){
    return this.getReputationEventsPage(route, params, page).flatMap(response => {
      if(response.error_id){
        throw response.error_message;
      }
      const items$ = Observable.from(response.items).map((obj, idx) => new SeReputationHistory(obj));
      const next$ = response.has_more
        ? this.getReputationEvents(route, params, ++page)
        : Observable.empty();
      if(response.backoff) console.log(response.backoff);
      return Observable.concat(items$, next$);
    });
  }

  private getPostsDataPage(route:String, params:String[], page:number){
    const localParams = params.concat(["page=" + page]);
    return this.http.get<SEResponseObject<SePostResponse>>(route + '?' + localParams.join('&'));
  }

  private getPostsData(route:String, params:String[], page:number){
    return this.getPostsDataPage(route, params, page).flatMap(response => {
      if(response.error_id){
        throw response.error_message;
      }
      const items$ = Observable.from(response.items).map((obj, idx) => new SePost(obj));
      const next$ = response.has_more
        ? this.getPostsData(route, params, ++page)
        : Observable.empty();
      return Observable.concat(items$, next$);
    });
  }

  public getReputationHistory(userId:Number, site:String, accessToken:String, dateRange:DateRange, page?:number): Observable<SeReputationHistory> {
    const route = 'https://api.stackexchange.com/2.2/users/' + userId + '/reputation-history/full';
    const params = [
      'key=' + StackExchangeService.apiKey,
      'site=' + site,
      'access_token=' + accessToken,
      'fromdate=' + dateRange.start.getTime()/1000,
      'todate=' + dateRange.end.getTime()/1000,
      "pagesize=" + 100
    ];
    return this.getReputationEvents(route, params, page || 1);
  }

  public getPosts(postIds:number[], site:String, accessToken:String, page?:number): Observable<SePost>{
    const route = 'https://api.stackexchange.com/2.2/posts/' + postIds.join(';');
    const params = [
      'key=' + StackExchangeService.apiKey,
      'site=' + site,
      'access_token=' + accessToken,
      'pagesize=' + 100
    ];
    return this.getPostsData(route, params, page || 1);
  }
}
