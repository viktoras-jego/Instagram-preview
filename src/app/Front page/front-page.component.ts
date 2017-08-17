import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { TimelineMax, Back } from 'gsap';
import $ from 'jquery/dist/jquery';
import { Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'front-page',
    templateUrl: './front-page.template.html'
})
export class FrontPageComponent implements OnInit, AfterViewInit {

    public loading: boolean = false;
    public images: any = [];
    public userId: any;
    @ViewChild('user')user: ElementRef;
    @ViewChild('checkbox')checkbox: ElementRef;

    constructor(private http: Http,
                protected route: ActivatedRoute) {}

    ngOnInit (): void {
        //
    }
    ngAfterViewInit (): void {
        this.checkRemember();
    }

    submit(e): any {
        this.sendRequest();
        this.remember();
        this.loading = true;
        this.user.nativeElement.blur();
        e.preventDefault();
    }

    sendRequest(): any {
        const username = this.user.nativeElement.value;
        $.ajax({
            url: 'https://igapi.ga/' + username + '/media/?count=9',
            dataType: 'jsonp',
            type: 'GET',
            success: (data) => {
                console.log(data);
                this.getData(data);
            },
            error: function(error){
                console.log(error); // send the error notifications to console
            }
        });
    }

    getData(data: any): void {
        // Gets Images
        data.items.forEach((item) => {
            this.images.unshift(item.images.standard_resolution.url);
        });
        // Gets User Id
        this.userId = data.items[0].user.id;
        this.getProfileData();
    }

    getProfileData(): any {
        const token = '258409839.1677ed0.76e37b79e4ee4f969268e2fb8da1d578', // learn how to obtain it below
            userid = this.userId;
        $.ajax({
            url: 'https://api.instagram.com/v1/users/' + userid + '/media/recent', // or /users/self/media/recent for Sandbox
            dataType: 'jsonp',
            type: 'GET',
            data: {access_token: token, count: 0},
            success: function(data){
                console.log(data);
            },
            error: function(data){
                console.log(data); // send the error notifications to console
            }
        });
    }

    checkRemember(): void {

        if (localStorage.getItem('Profile_Preview_Username')) {
            this.checkbox.nativeElement.checked = true;
            this.user.nativeElement.value = localStorage.getItem('Profile_Preview_Username');
        }
    }

    remember(): void {
        if (this.checkbox.nativeElement.checked) {
            this.saveUsername();
        } else {
            this.unsaveUsername();
        }
    }

    saveUsername(): void {
        localStorage.setItem('Profile_Preview_Username', this.user.nativeElement.value);
    }

    unsaveUsername (): void {
        localStorage.removeItem('Profile_Preview_Username');
    }

}
