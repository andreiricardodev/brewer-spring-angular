import {Injectable} from '@angular/core';
import {AuthHttp} from "angular2-jwt";
import {environment} from "../../environments/environment";
import {DashboardDTO} from "../shared/dto";

@Injectable()
export class DashboardService {

    dashboardoUrl: string;

    constructor(private http: AuthHttp) {
        this.dashboardoUrl = `${environment.apiUrl}/dashboard`;
    }

    dashboard(): Promise<DashboardDTO> {
        return this.http.get(this.dashboardoUrl)
            .toPromise()
            .then(response => response.json() as DashboardDTO);
    }

}
