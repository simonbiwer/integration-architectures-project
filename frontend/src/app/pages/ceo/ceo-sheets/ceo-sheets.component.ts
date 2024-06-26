import { Component, inject, OnInit } from '@angular/core';

import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SheetSummary } from '../../../models/SheetSummary';
import { SheetsComponent } from '../../../components/sheets/sheets.component';
import { Role } from 'src/app/models/User';
import { UserService } from 'src/app/services/user.service';
import { SheetsAllService } from 'src/app/services/sheets-all.service';
import { calculatePercentage } from 'src/app/services/calculate-progression.service';
import { DashboardComponent } from 'src/app/components/dashboard/dashboard.component';
import { CommonModule } from '@angular/common';
@Component({
    selector: 'app-ceo-sheets',
    standalone: true,
    imports: [
        MatTableModule,
        MatProgressBarModule,
        SheetsComponent,
        SheetsComponent,
        DashboardComponent,
        CommonModule
    ],
    templateUrl: './ceo-sheets.component.html',
    styleUrls: ['./ceo-sheets.component.css'],
})
export class CeoSheetsComponent implements OnInit {
    private userService = inject(UserService);
    private sheetsService = inject(SheetsAllService);
    displayedColumns = [
        'salesman',
        'firstname',
        'lastname',
        'year',
        'bonus',
        'status',
    ];

    pendingSheets: SheetSummary[] = [];
    restSheets: SheetSummary[] = [];
    roleLoggedIn: Role;
    finishedPercentage: number;
    percentage: number;
    fetchDonePending: boolean;
    fetchDoneRest: boolean;

    fetchCompleted() {
        return this.fetchDoneRest && this.fetchDonePending;
    }

    ngOnInit(): void {
        this.userService.getOwnUser().subscribe((user) => {
            this.roleLoggedIn = user.role;
            this.fetchPendingSalesman();
            this.fetchRestPendingSalesman();
            this.percentage = calculatePercentage(
                this.pendingSheets.concat(this.restSheets)
            );
        });
    }

    fetchPendingSalesman(): void {
        this.sheetsService
            .getPendingSheets(this.roleLoggedIn)
            .subscribe((response): void => {
                if (response.status === 200) {
                    this.pendingSheets = response.body;
                    this.fetchDonePending = true
                    if (
                        this.pendingSheets.length > 0 ||
                        this.restSheets.length > 0
                    ) {
                        this.percentage = calculatePercentage(
                            this.pendingSheets.concat(this.restSheets)
                        );
                    }
                }
            });
    }
    fetchRestPendingSalesman(): void {
        this.sheetsService
            .getNotPendingSheets(this.roleLoggedIn)
            .subscribe((response): void => {
                if (response.status === 200) {
                    this.restSheets = response.body;
                    this.fetchDoneRest = true

                    if (
                        this.pendingSheets.length > 0 ||
                        this.restSheets.length > 0
                    ) {
                        this.percentage = calculatePercentage(
                            this.pendingSheets.concat(this.restSheets)
                        );
                    }
                }
            });
    }
}
