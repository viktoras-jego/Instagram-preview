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

        // let step = this.route.snapshot.queryParams['step'];
        const token = '258409839.1677ed0.76e37b79e4ee4f969268e2fb8da1d578', // learn how to obtain it below
            userid = 258409839, // User ID - get it in source HTML of your Instagram profile or look at the next example :)
            num_photos = 4;
        $.ajax({
            url: 'https://api.instagram.com/v1/users/' + userid + '/media/recent', // or /users/self/media/recent for Sandbox
            dataType: 'jsonp',
            type: 'GET',
            data: {access_token: token, count: num_photos},
            success: function(data){
                console.log(data);
            },
            error: function(data){
                console.log(data); // send the error notifications to console
            }
        });

        this.http.get('https://api.instagram.com/v1/users/' + userid + '/media/recent?access_token=' + token, {
            body: {access_token: token, count: num_photos}
        }).subscribe(
         ok => {console.log(ok); },
            ee => {}
        );
        if (this.user.nativeElement.value === '') {
            e.preventDefault();
            return;
        }

        this.remember();
        this.loading = true;
        this.user.nativeElement.blur();
        e.preventDefault();
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
