import { AfterViewInit, Component, ElementRef, OnChanges, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { TimelineMax, Back } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import $ from 'jquery/dist/jquery';
import { Http } from '@angular/http';
import { NgxCroppieComponent } from 'ngx-croppie';
import { CroppieOptions } from 'croppie';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'front-page',
    templateUrl: './front-page.template.html'
})
export class FrontPageComponent implements OnInit, AfterViewInit, OnChanges {

    public loading: boolean = false;
    public screenWidth: number;
    public images: any = [];
    public userInfo: any = {fullName: '', profilePicture: '', username: ''};
    public status: string = '';
    public dummyPhotos = [
        'https://scontent-iad3-1.cdninstagram.com/t51.2885-15/s150x150/e35/c0.108.873.873/20066799_706414102898617_3184857248010600448_n.jpg',
        'https://scontent-iad3-1.cdninstagram.com/t51.2885-15/s150x150/e35/c0.107.861.861/20184919_116943978935194_8567338812005416960_n.jpg',
        'https://scontent-iad3-1.cdninstagram.com/t51.2885-15/s150x150/e35/c0.99.797.797/20185014_286653648475373_1163594412438061056_n.jpg',
        'https://scontent-iad3-1.cdninstagram.com/t51.2885-15/s150x150/e35/c0.134.1080.1080/20214307_329021344190130_4159934563595845632_n.jpg',
        'https://scontent-iad3-1.cdninstagram.com/t51.2885-15/s150x150/e35/c0.100.799.799/20398961_122189688403027_2017131716983914496_n.jpg',
        'https://scontent-iad3-1.cdninstagram.com/t51.2885-15/s150x150/e35/c0.103.827.827/20394388_1434919299926135_5052655095301275648_n.jpg',
        'https://scontent-iad3-1.cdninstagram.com/t51.2885-15/s150x150/e35/c0.135.1080.1080/20481786_1422217437861803_1942832815737405440_n.jpg',
        'https://scontent-iad3-1.cdninstagram.com/t51.2885-15/s150x150/e35/c0.62.595.595/20590310_471501456556266_1623176528953081856_n.jpg',
        'https://scontent-iad3-1.cdninstagram.com/t51.2885-15/s150x150/e35/c0.99.797.797/20688322_292010481266899_7157904075021877248_n.jpg',
        'https://scontent-iad3-1.cdninstagram.com/t51.2885-15/s150x150/e35/c0.100.799.799/20398961_122189688403027_2017131716983914496_n.jpg',
        'https://scontent-iad3-1.cdninstagram.com/t51.2885-15/s150x150/e35/c0.134.1080.1080/20214307_329021344190130_4159934563595845632_n.jpg',
        'https://scontent-iad3-1.cdninstagram.com/t51.2885-15/s150x150/e35/c0.107.861.861/20184919_116943978935194_8567338812005416960_n.jpg',
    ];
    public dummyUser = {
        fullName: 'Marius Pilipas',
        profilePicture: 'https://scontent-iad3-1.cdninstagram.com/t51.2885-19/s150x150/14591986_1052414564904497_290196869877858304_n.jpg',
        username: 'granmarino'
    };

    widthPx = '300';
    heightPx = '300';
    imageUrl = '';
    currentImage: string;
    croppieImage: string;

    @ViewChild('user')user: ElementRef;
    @ViewChild('checkbox')checkbox: ElementRef;
    @ViewChild('profileUI')profileUI: ElementRef;
    @ViewChild('loginScreen')loginScreen: ElementRef;
    @ViewChild('list')list: ElementRef;
    @ViewChild('ngxCroppie') ngxCroppie: NgxCroppieComponent;

    constructor(private http: Http,
                protected route: ActivatedRoute) {}

    ngOnInit (): void {
        this.screenWidth = window.innerWidth;
        this.currentImage = this.imageUrl;
        this.croppieImage = this.imageUrl;
    }

    public get imageToDisplay() {
        if (this.currentImage) { return this.currentImage; }
        if (this.imageUrl) { return this.imageUrl; }
        return `http://placehold.it/${this.widthPx}x${this.heightPx}`;
    }

    public get croppieOptions(): CroppieOptions {
        const opts: CroppieOptions = {};
        opts.viewport = {
            width: parseInt(this.widthPx, 10),
            height: parseInt(this.heightPx, 10)
        };
        opts.boundary = {
            width: parseInt(this.widthPx, 10),
            height: parseInt(this.heightPx, 10)
        };
        opts.enforceBoundary = true;
        return opts;
    }

    newImageResultFromCroppie(img: string) {
        this.croppieImage = img;
    }

    saveImageFromCroppie() {
        this.currentImage = this.croppieImage;
        this.croppieImage = '';
        this.currentImage = '';
    }

    cancelCroppieEdit() {
        this.croppieImage = this.currentImage;
    }

    imageUploadEvent(evt: any) {
        if (!evt.target) { return; }
        if (!evt.target.files) { return; }
        if (evt.target.files.length !== 1) { return; }
        const file = evt.target.files[0];
        if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif' && file.type !== 'image/jpg') { return; }
        const fr = new FileReader();
        fr.onloadend = (loadEvent) => {
            this.croppieImage = fr.result;
        };
        fr.readAsDataURL(file);
    }

    ngOnChanges(changes: any) {
        if (this.croppieImage) { return; }
        if (!changes.imageUrl) { return; }
        if (!changes.imageUrl.previousValue && changes.imageUrl.currentValue) {
            this.croppieImage = changes.imageUrl.currentValue;
        }
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
            url: 'https://igapi.ga/' + username + '/media/?count=12',
            dataType: 'jsonp',
            type: 'GET',
            success: (data) => {
                console.log(data);
                this.getData(data);
            },
            error: function(error){
                console.log(error);
                console.log('User does not exist'); // send the error notifications to console
            }
        });
    }

    getData(data: any): void {
        // checks if user is not Private
        if (0 < data.items.length) {
            // Gets Images
            data.items.forEach((item) => {
                this.images.unshift(item.images.thumbnail.url);
            });
            this.userInfo.fullName = data.items[0].user.full_name;
            this.userInfo.profilePicture = data.items[0].user.profile_picture;
            this.userInfo.username = data.items[0].user.username;
            console.log(this.userInfo);
            console.log(this.images);
            this.openProfile();
        }
    }

    openProfile(): any {
        const time = 1.3;
        const tl = new TimelineMax({});
        const profileUI = this.profileUI.nativeElement;
        const loginScreen = this.loginScreen.nativeElement;
        tl.to(loginScreen, time, {
            opacity: 0
        });
        setTimeout(() => {
            this.status = 'Public';
        }, time * 1000);
        tl.to(profileUI, time, {
            opacity: 1
        });
        setTimeout(() => {
            this.loading = false;
        }, time * 2300);
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
    onResize(event) {
        this.screenWidth = event.target.innerWidth;
    }

}
