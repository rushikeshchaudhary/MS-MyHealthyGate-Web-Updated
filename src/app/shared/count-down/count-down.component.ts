import { DatePipe } from '@angular/common';
import { Component, OnInit, Inject, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { TranslateService } from "@ngx-translate/core";


@Component({
    selector: 'app-count-down',
    templateUrl: './count-down.component.html',
    styleUrls: ['./count-down.component.scss']
})
export class CountDownComponent implements OnInit, OnDestroy {

    @Input() inputDate!: Date;
    @Input() cssHide: boolean = true;
    @Input() heading!: string;
    @Output() triggerEvent = new EventEmitter();
    @Input() countercolor!:string;
    @Input() show:boolean=true;
    private subscription!: Subscription;
    public dynamicColor!:string;
    public dateNow = new Date();
    milliSecondsInASecond = 1000;
    hoursInADay = 24;
    minutesInAnHour = 60;
    SecondsInAMinute = 60;
    timer: any;
    empty: any;
    public timeDifference:any;
    public secondsToDday!: number;
    public minutesToDday!: number;
    public hoursToDday!: number;
    public daysToDday!: number;
    dd!: Date;
    
    
    constructor(private translate: TranslateService) {
        translate.setDefaultLang(localStorage.getItem("language") || "en");
        translate.use(localStorage.getItem("language") || "en");
        /*  let date = new Date();
          date.setHours(date.getHours() +2 );
          this.dd  = date;*/

    }
    ngOnInit() {

        
        let date = new Date();
        date.setHours(date.getHours() + 2);
        this.dd = date;
        this.subscription = interval(1000)
            .subscribe(x => { this.getTimeDifference(); });
    }
    enableButtons() {
        // if (this.daysToDday == 0 && this.hoursToDday == 0 && this.minutesToDday <= 8) {
        if (this.daysToDday == 0 && this.hoursToDday == 0 && this.minutesToDday == 0 && this.secondsToDday == 0) {
            this.triggerEvent.emit(true);
        }
    }
    private getTimeDifference() {
        this.dynamicColor = this.countercolor != null ? this.countercolor : "red";
        // this.timeDifference = this.dd.getTime() - new Date().getTime();
        this.timeDifference = new Date(this.inputDate).getTime() - new Date().getTime();
        this.allocateTimeUnits(this.timeDifference);
    }

    private allocateTimeUnits(timeDifference: any) {
        this.secondsToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute);
        this.minutesToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute);
        this.hoursToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay);
        this.daysToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute * this.hoursInADay));

        // console.log('Days', this.daysToDday);
        // console.log('Hours', this.hoursToDday);
        // console.log('Minutes', this.minutesToDday);
        // console.log('Seconds', this.secondsToDday);
        this.enableButtons();
    }

    get isShowDays(): boolean {
        return (this.daysToDday > 0) ? true : false;
    }

    get isShowHours(): boolean {
        return (this.isShowDays || this.hoursToDday > 0) ? true : false;
    }

    get isShowMints(): boolean {
        return (this.isShowHours || this.minutesToDday > 0) ? true : false;
    }

    get isShowSeconds(): boolean {
        return (this.isShowMints || this.secondsToDday > 0) ? true : false;
    }


    ngOnDestroy() {
        // this.subscription.unsubscribe();
    }




}
