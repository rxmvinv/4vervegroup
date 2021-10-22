import { Injectable } from '@angular/core';
import { Banner } from './banner';
//import { BANNERS } from './mock-banners';
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

export class BannerService {

  getBanners(): Observable<Banner[]> {
    // TODO: send the message _after_ fetching the banners
    this.messageService.add('BannerService: fetched banners');
    return this.http.get<Banner[]>(this.bannersUrl)
      .pipe(
        tap(banners => this.log('fetched banners')),
        catchError(this.handleError('getBanners', []))
      );
  }

  getBanner(id: number): Observable<Banner> {
    const url = `${this.bannersUrl}/${id}`;
    return this.http.get<Banner>(url).pipe(
      tap(_ => this.log(`fetched banner id=${id}`)),
      catchError(this.handleError<Banner>(`getBanner id=${id}`))
    );
  }

  updateBanner (banner: Banner): Observable<any> {
    const url = `${this.bannersUrl}/${banner.id}`
    return this.http.put(url, banner, httpOptions).pipe(
      tap(_ => this.log(`updated banner id=${banner.id}`)),
      catchError(this.handleError<any>('updateBanner'))
    );
  }

  addBanner (banner: Banner): Observable<Banner> {
    const newBanner = banner
    newBanner.id = this.lastId

    return this.http.post<Banner>(this.bannersUrl, newBanner, httpOptions).pipe(
      tap((banner: Banner) => {
        this.log(`added banner w/ id=${newBanner.id}`)
        this.setId(newBanner.id + 1);
      }),
      catchError(this.handleError<Banner>('addBanner'))
    );
  }

  deleteBanner (banner: Banner | number): Observable<Banner> {
    const id = typeof banner === 'number' ? banner : banner.id;
    const url = `${this.bannersUrl}/${id}`;

    return this.http.delete<Banner>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted banner id=${id}`)),
      catchError(this.handleError<Banner>('deleteBanner'))
    );
  }

  searchBanners(term: string): Observable<Banner[]> {
    if (!term.trim()) {
      // if not search term, return empty banner array.
      return of([]);
    }
    return this.http.get<Banner[]>(`${this.bannersUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`found banners matching "${term}"`)),
      catchError(this.handleError<Banner[]>('searchBanners', []))
    );
  }

  setId(id: number): void {
    this.lastId = id
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

  /** Log a BannerService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`BannerService: ${message}`);
  }

  private bannersUrl = 'http://localhost:3001/api/banners';  // URL to web api
  private lastId = 1
}
