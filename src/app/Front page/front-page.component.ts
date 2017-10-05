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
        username: ''
    };
    public status: string = '';

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
        console.log(this.screenWidth);
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
        opts.enforceBoundary = true;
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
            url: 'https://igpi.ga/' + username + '/media/?count=12',
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
        if (0 < data.items.length) {
            // Gets Images
            data.items.forEach((item) => {
                this.images.push(item.images.thumbnail.url);
            });
            this.userInfo.fullName = data.items[0].user.full_name;
            this.userInfo.profilePicture = data.items[0].user.profile_picture;
            this.userInfo.username = data.items[0].user.username;
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
