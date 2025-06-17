import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { finalize } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {CommonService} from '../services/common.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('infoMessages') infoMessages!: ElementRef;

  environment:any = environment;
  request_id:any = null;
  location_id:any = null;

  successMsg:any = null;
  errorMsg:any = null;

  pwaData:any = null;
  rego: any;
  afMessage: any = null;
  sendSmsProgress: boolean = false;
  loading: boolean = true;

  displayMessage: string = '';
  processedTopContent: string = '';

  constructor(
      private commonService: CommonService,
      private router: Router,
      private activatedRoute: ActivatedRoute
    ) { 
      this.activatedRoute.params.subscribe(params => {
        this.request_id = params['request_id'];
        this.location_id = params['location_id'];

        if (!this.location_id) {
          this.router.navigate(['/404']);
        } else {
          this.getPwaData();
        }
      });
    }

  ngOnInit(): void { }

  processTopContent(content: string): string {
    const phoneRegex = /\b\d{9,15}\b/g;
    return content.replace(phoneRegex, '<a href="tel:$&">$&</a>');
  }

  getPwaData() {
    const payload = {
      location_id: this.location_id,
      request_id: this.request_id
    };

    this.commonService.getSmsData(payload).pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (response) => {
        if(response.success){
          this.pwaData = response.data;
          if(!this.pwaData) {
            this.displayMessage = 'Something went wrong. Please try again later.';
          } else {
            this.processedTopContent = this.processTopContent(this.pwaData?.top_content ?? '');
          }
          // if(response.message && response.message === "Already filled") {
          //   this.displayMessage = 'The form has already been filled.';
          // }
          if(response.code && response.code === 200) {
            this.displayMessage = 'The form has already been filled.';
          }
          
        } else {
          this.router.navigate(['/404']);
        }
      },
      error: (error) => {
        console.error('Error:', error);
        this.router.navigate(['/404']);
      }
    });
  }

  sendSms(){  
    this.hideMessages();
    this.sendSmsProgress = true;	

    const payload = {
      location_id: this.location_id,
      request_id: this.request_id,
      rego:  this.rego,
      af_message: this.afMessage
    };
  
    this.commonService.sendReply(payload).pipe(
      finalize(() => {
        this.sendSmsProgress = false;	
      })
    ).subscribe({
      next: (response) => {
        console.log('Success:', response);
        if(response.success){
          this.errorMsg = null;
          this.displayMessage = 'Thank you for your message.';
        } else {
          this.successMsg = null;
          this.errorMsg = response.message;
          setTimeout(() => {
            this.infoMessages.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 0);
        }
      },
      error: (err) => {         
        this.successMsg = null;
        this.errorMsg = err.error.message;
        console.error('Error:', err);

        setTimeout(() => {
          this.infoMessages.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 0);

      }     
    });
  }

  hideMessages(){
    this.errorMsg = null;
    this.successMsg = null;
  }

}
