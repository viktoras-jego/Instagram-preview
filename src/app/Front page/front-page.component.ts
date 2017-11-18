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
    public userInfo = {
        fullName: '',
        profilePicture: '',
        username: '',
        posts: 0,
        followed: '',
        follows: 0
    };
    public status: string = '';

    /* public dummyPhotos = [
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
            ];*/
    /* public dummyUser = {
        fullName: 'Marius Pilipas',
        profilePicture: 'https://scontent-iad3-1.cdninstagram.com/t51.2885-19/s150x150/14591986_1052414564904497_290196869877858304_n.jpg',
        username: 'granmarino',
        posts: '197',
        followed: '1610',
        follows: '608'
    }; */


        widthPx = '80vw';
    heightPx = '80vw';
    imageUrl = '';
    currentImage: string;
    croppieImage: string;
    currentOrientation: number = 0;
    orientation: number = 1;

    @ViewChild('user')user: ElementRef;
    @ViewChild('checkbox')checkbox: ElementRef;
    @ViewChild('profileUI')profileUI: ElementRef;
    @ViewChild('loginScreen')loginScreen: ElementRef;
    @ViewChild('errorScreen')errorScreen: ElementRef;
    @ViewChild('list')list: ElementRef;
    @ViewChild('inputFile')inputFile: ElementRef;
    @ViewChild('usernameInput')usernameInput: ElementRef;
    @ViewChild('ngxCroppie') ngxCroppie: NgxCroppieComponent;

    constructor(private http: Http,
                protected route: ActivatedRoute) {
    }

    ngOnInit (): void {
        this.screenWidth = window.innerWidth;
        this.currentImage = this.imageUrl;
        this.croppieImage = this.imageUrl;
        if (this.screenWidth > 992) {
            this.widthPx = '450px';
            this.heightPx = '450px';
        }
    }

    public get croppieOptions(): CroppieOptions {
        const opts: CroppieOptions = {};
        opts.viewport = {
            width: this.widthPx,
            height: this.heightPx
        };
        opts.boundary = {
            width: this.widthPx,
            height: this.heightPx
        };
        opts.enforceBoundary = false;
        opts.enableExif = true;
        opts.enableOrientation = true;
        return opts;
    }

    newImageResultFromCroppie(img: string) {
        this.croppieImage = img;
    }

    saveImageFromCroppie() {
        this.currentImage = this.croppieImage;
        if (this.inputFile.nativeElement.value !== '') {
            this.imageDisplay();
        }
    }

    clearImage() {
        this.inputFile.nativeElement.value = '';
        this.croppieImage = '';
        this.currentImage = '';
        this.orientation = 1;
        this.currentOrientation = 0;
    }

    imageDisplay() {
        this.images.splice(11, 11);
        this.images.unshift(this.currentImage);
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
            url: 'https://igpi.ga/' + username + '/?__a=1',
            dataType: 'jsonp',
            type: 'GET',
            success: (data) => {
                this.getData(data);
            },
            error: () => {
                this.showError();
            }
        });
    }

    getData(data: any): void {
        // checks if user is not Private
        if (0 < data.user.media.nodes.length) {
            // Gets Images
            data.user.media.nodes.forEach((item) => {
                this.images.push(item.thumbnail_src);
            });

            this.userInfo.fullName = data.user.full_name;
            this.userInfo.profilePicture = data.user.profile_pic_url_hd;
            this.userInfo.username = data.user.username;
            this.userInfo.posts = data.user.media.count;
            this.userInfo.follows = data.user.follows.count;
            this.checkFollowed(data.user.followed_by.count);

            this.openProfile();
        }
    }

     checkFollowed(currentFollowed: any): any {
        if ((currentFollowed > 10000) && (currentFollowed < 1000000)) {
            const follow = currentFollowed / 1000;
            const with2Decimals = follow.toString().match(/^-?\d+(?:\.\d{0,1})?/)[0];
            this.userInfo.followed = with2Decimals + 'k';
        }

        if (currentFollowed > 1000000) {
            const follow = currentFollowed / 1000000;
            const with2Decimals = follow.toString().match(/^-?\d+(?:\.\d{0,1})?/)[0];
            this.userInfo.followed = with2Decimals + 'm';
        } else if (currentFollowed < 10000) {
            this.userInfo.followed = currentFollowed;
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
        }, time * 1400);
    }

    showError(): void {
        const time = 1.3;
        const tl = new TimelineMax({});
        const errorScreen = this.errorScreen.nativeElement;
        const loginScreen = this.loginScreen.nativeElement;
        tl.to(loginScreen, time, {
            opacity: 0
        });
        setTimeout(() => {
            this.status = 'Error';
        }, time * 1000);
        tl.to(errorScreen, time, {
            opacity: 1
        });
        setTimeout(() => {
            this.loading = false;
        }, time * 1000);
    }

    showLogin(): void {
        this.loading = true;
        const tl = new TimelineMax({});
        setTimeout(() => {
            this.status = '';
            const loginScreen = this.loginScreen.nativeElement;
            tl.to(loginScreen, 1.3, {
                opacity: 1
            });
        },  1000);
        setTimeout(() => {
            this.loading = false;
            const errorScreen = this.errorScreen.nativeElement;
            tl.to(errorScreen, 0, {
                opacity: 1
            });
        }, 1500);
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
        if (this.screenWidth > 992) {
            this.widthPx = '450px';
            this.heightPx = '450px';
        }
    }
    onFocus(target) {
        target.scrollIntoView({behavior: 'smooth'});
    }

}
