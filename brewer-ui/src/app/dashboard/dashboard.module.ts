import {NgModule} from '@angular/core';

import {ChartModule} from "primeng/primeng";

import {SharedModule} from "../shared/shared.module";
import {DashboardComponent} from "./dashboard.component";
import {DashboardRoutingModule} from "./dashboard-routing.module";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
    imports: [
        SharedModule,
        ReactiveFormsModule,

        ChartModule,

        DashboardRoutingModule
    ],
    declarations: [
        DashboardComponent
    ]
})
export class DashboardModule {
}
