import { Injectable } from '@angular/core';
import { Campaign } from './campaign';
//import { CAMPAIGNS } from './mock-campaigns';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class CampaignService {

  getCampaigns(): Observable<Campaign[]> {
    // TODO: send the message _after_ fetching the campaigns
    this.messageService.add('CampaignService: fetched campaigns');
    return this.http.get<Campaign[]>(this.campaignsUrl)
      .pipe(
        tap(campaigns => this.log('fetched campaigns')),
        catchError(this.handleError('getCampaigns', []))
      );
  }

  getCampaign(id: number): Observable<Campaign> {
    const url = `${this.campaignsUrl}/${id}`;
    return this.http.get<Campaign>(url).pipe(
      tap(_ => this.log(`fetched campaign id=${id}`)),
      catchError(this.handleError<Campaign>(`getCampaign id=${id}`))
    );
  }

  updateCampaign (campaign: Campaign): Observable<any> {
    return this.http.put(`${this.campaignsUrl}/${campaign.id}`, 
      campaign, httpOptions).pipe(
        tap(_ => this.log(`updated campaign id=${campaign.id}`)),
        catchError(this.handleError<any>('updateCampaign'))
      );
  }

  addCampaign (campaign: Campaign): Observable<Campaign> {
    const newCampaign = campaign
    newCampaign.id = this.lastId
    return this.http.post<Campaign>(this.campaignsUrl, newCampaign, httpOptions).pipe(
      tap((campaign: Campaign) => this.log(`added campaign w/ id=${campaign.id}`)),
      catchError(this.handleError<Campaign>('addCampaign'))
    );
  }

  deleteCampaign (campaign: Campaign | number): Observable<Campaign> {
    const id = typeof campaign === 'number' ? campaign : campaign.id;
    const url = `${this.campaignsUrl}/${id}`;

    return this.http.delete<Campaign>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted campaign id=${id}`)),
      catchError(this.handleError<Campaign>('deleteCampaign'))
    );
  }

  searchCampaigns(term: string): Observable<Campaign[]> {
    if (!term.trim()) {
      // if not search term, return empty campaign array.
      return of([]);
    }
    return this.http.get<Campaign[]>(`${this.campaignsUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`found campaigns matching "${term}"`)),
      catchError(this.handleError<Campaign[]>('searchCampaigns', []))
    );
  }

  setId(id: number): void {
    this.lastId = id
  }

  setActivity(
    campaign: Campaign, 
    period: number, 
    time: number
  ): void {
    // const timeCalc = (arg: number) => moment().hours(arg);
    this.activity = [period, time]
    // campaign.isActive = timeCalc(time).get('hour') >= moment().get('hour') && 
    //   timeCalc(time + 1).get('hour') < moment().get('hour')
  }

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a CampaignService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`CampaignService: ${message}`);
  }

  private campaignsUrl = 'http://localhost:3001/api/campaigns';  // URL to web api
  private lastId = 1
  private activity = [0,0];
  // private isActive = false;
}
