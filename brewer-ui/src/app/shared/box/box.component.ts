import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-box',
    templateUrl: './box.component.html',
    styleUrls: ['./box.component.css']
})
export class BoxComponent implements OnInit {

    @Input() icone: string;
    @Input() titulo: string;
    @Input() valor: string;
    @Input() valorNegativo = false;

    constructor() {
    }

    ngOnInit() {
    }

    classeCss() {
        return 'fa ' + this.icone + ' fa-3x';
    }

}
