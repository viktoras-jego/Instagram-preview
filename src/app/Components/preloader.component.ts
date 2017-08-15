import { Component } from '@angular/core';

@Component({
    selector: 'preloader',
    template: `
        <div class="layer">
            <div class="preloader-row">
                <div class="spinningCircle"></div>
            </div>
        </div>
    `
})
export class PreloaderComponent  {}
