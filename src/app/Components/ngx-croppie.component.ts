import { NgxCroppieModule } from 'ngx-croppie';
import {
    Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, OnInit, ViewChild,
    ElementRef, OnChanges
} from '@angular/core';
import Croppie from 'croppie';
import { CroppieOptions } from 'croppie';

@Component({
    selector: 'ng-croppie',
    template: `<div #imageEdit (update)="newResult()"></div>`
})
export class NgxCroppieComponent implements OnInit, OnChanges {
    @ViewChild('imageEdit') imageEdit: ElementRef;
    @Input() croppieOptions: CroppieOptions;
    @Input() orientation: any;
    @Input() rotate: any;
    @Input() imageUrl: string;
    @Input() bind: (img: string) => void;
    @Output() result: EventEmitter<string> = new EventEmitter<string>();

    private _croppie: Croppie;
    public orient: any = 1;
    ngOnInit(): void {
        this._croppie = new Croppie(this.imageEdit.nativeElement, this.croppieOptions);

        this._croppie.bind({
            url: this.imageUrl,
            orientation: this.orientation
        });
        this.bind = (img: string) => {
            this._croppie.bind({ url: this.imageUrl });
        };
    }

    ngOnChanges(): void {
        if (this.orient !== this.orientation) {
            this._croppie.bind({
                url: this.imageUrl,
                orientation: this.orientation
            });
            this.orient = this.orientation;
        }
    }

    newResult() {
        this._croppie.result({ type: 'base64', size: 'viewport' }).then((res) => {
            this.result.emit(res);
        });
    }
}