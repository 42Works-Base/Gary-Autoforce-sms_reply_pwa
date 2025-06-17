import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { NetworkService } from './core/services/network.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'sms-app';
  apiUrl = environment.apiUrl;
  public isOnline$: Observable<boolean>;

  constructor(public networkService: NetworkService) {
    this.isOnline$ = this.networkService.isOnline$;
  }
}
