import { NgModule } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { AuditLogsComponent } from './audit-logs/audit-logs.component';
import { HostDashboardComponent } from './dashboard/host-dashboard.component';
import { DemoUiComponentsComponent } from './demo-ui-components/demo-ui-components.component';
import { EditionsComponent } from './editions/editions.component';
import { InstallComponent } from './install/install.component';
import { LanguageTextsComponent } from './languages/language-texts.component';
import { LanguagesComponent } from './languages/languages.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { OrganizationUnitsComponent } from './organization-units/organization-units.component';
import { RolesComponent } from './roles/roles.component';
import { HostSettingsComponent } from './settings/host-settings.component';
import { TenantSettingsComponent } from './settings/tenant-settings.component';
import { InvoiceComponent } from './subscription-management/invoice/invoice.component';
import { SubscriptionManagementComponent } from './subscription-management/subscription-management.component';
import { TenantsComponent } from './tenants/tenants.component';
import { UiCustomizationComponent } from './ui-customization/ui-customization.component';
import { UsersComponent } from './users/users.component';
import { WebhookSubscriptionComponent } from './webhook-subscription/webhook-subscription.component';
import { WebhookSubscriptionDetailComponent } from './webhook-subscription/webhook-subscription-detail.component';
import { WebhookEventDetailComponent } from './webhook-subscription/webhook-event-detail.component';
import { DynamicParameterComponent } from './dynamic-entity-parameters/dynamic-parameter/dynamic-parameter.component';
import { DynamicParameterDetailComponent } from './dynamic-entity-parameters/dynamic-parameter/dynamic-parameter-detail.component';
import { EntityDynamicParameterComponent } from './dynamic-entity-parameters/entity-dynamic-parameter/entity-dynamic-parameter.component';
import { EntityDynamicParameterValueComponent } from './dynamic-entity-parameters/entity-dynamic-parameter/entity-dynamic-parameter-value/entity-dynamic-parameter-value.component';
import { EmployeeComponent } from './employee/employee.component';
import { BooksComponent } from './books/books.component';
import { BorrowBookComponent } from './borrow-book/borrow-book.component';
import { TypeCardComponent } from './type-card/type-card.component';
import { TypeBookComponent } from './type-book/type-book.component';
import { ReturnBookComponent } from './return-book/return-book.component';
import { PunishComponent } from './punish/punish.component';


@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [
                    { path: 'users', component: UsersComponent, data: { permission: 'Pages.Administration.Users' } },
                    { path: 'roles', component: RolesComponent, data: { permission: 'Pages.Administration.Roles' } },
                    { path: 'auditLogs', component: AuditLogsComponent, data: { permission: 'Pages.Administration.AuditLogs' } },
                    { path: 'maintenance', component: MaintenanceComponent, data: { permission: 'Pages.Administration.Host.Maintenance' } },
                    { path: 'hostSettings', component: HostSettingsComponent, data: { permission: 'Pages.Administration.Host.Settings' } },
                    { path: 'editions', component: EditionsComponent, data: { permission: 'Pages.Editions' } },
                    { path: 'languages', component: LanguagesComponent, data: { permission: 'Pages.Administration.Languages' } },
                    { path: 'languages/:name/texts', component: LanguageTextsComponent, data: { permission: 'Pages.Administration.Languages.ChangeTexts' } },
                    { path: 'tenants', component: TenantsComponent, data: { permission: 'Pages.Tenants' } },
                    { path: 'organization-units', component: OrganizationUnitsComponent, data: { permission: 'Pages.Administration.OrganizationUnits' } },
                    { path: 'subscription-management', component: SubscriptionManagementComponent, data: { permission: 'Pages.Administration.Tenant.SubscriptionManagement' } },
                    { path: 'invoice/:paymentId', component: InvoiceComponent, data: { permission: 'Pages.Administration.Tenant.SubscriptionManagement' } },
                    { path: 'tenantSettings', component: TenantSettingsComponent, data: { permission: 'Pages.Administration.Tenant.Settings' } },
                    { path: 'hostDashboard', component: HostDashboardComponent, data: { permission: 'Pages.Administration.Host.Dashboard' } },
                    { path: 'employee', component: EmployeeComponent, data: { permission: 'Pages.Administration.Host.Dashboard' } },
                    { path: 'book', component: BooksComponent, data: { permission: 'Pages.Administration.Host.Dashboard' } },
                    { path: 'borrow-book', component: BorrowBookComponent, data: { permission: null } },
                    { path: 'return-book', component: ReturnBookComponent, data: { permission: null } },
                    { path: 'punish', component: PunishComponent, data: { permission: null } },
                    { path: 'typecard', component: TypeCardComponent, data: { permission: 'Pages.Administration.Host.Dashboard' } },
                    { path: 'typebook', component: TypeBookComponent, data: { permission: 'Pages.Administration.Host.Dashboard' } },
                    { path: 'demo-ui-components', component: DemoUiComponentsComponent, data: { permission: 'Pages.DemoUiComponents' } },                  
                    { path: 'install', component: InstallComponent },
                    { path: 'ui-customization', component: UiCustomizationComponent },
                    { path: 'webhook-subscriptions', component: WebhookSubscriptionComponent, data: { permission: 'Pages.Administration.WebhookSubscription' } },
                    { path: 'webhook-subscriptions-detail', component: WebhookSubscriptionDetailComponent, data: { permission: 'Pages.Administration.WebhookSubscription.Detail' } },
                    { path: 'webhook-event-detail', component: WebhookEventDetailComponent, data: { permission: 'Pages.Administration.WebhookSubscription.Detail' } },
                    { path: 'dynamic-parameter', component: DynamicParameterComponent, data: { permission: 'Pages.Administration.DynamicParameters' } },
                    { path: 'dynamic-parameter-detail', component: DynamicParameterDetailComponent, data: { permission: 'Pages.Administration.DynamicParameters' } },
                    { path: 'entity-dynamic-parameter', component: EntityDynamicParameterComponent, data: { permission: 'Pages.Administration.EntityDynamicParameters' } },
                    { path: 'entity-dynamic-parameter-value/manage-all/:entityFullName/:rowId', component: EntityDynamicParameterValueComponent, data: { permission: 'Pages.Administration.EntityDynamicParameters' } },
                    { path: '', redirectTo: 'hostDashboard', pathMatch: 'full' },
                    { path: '**', redirectTo: 'hostDashboard' }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AdminRoutingModule {

    constructor(
        private router: Router
    ) {
        router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                window.scroll(0, 0);
            }
        });
    }
}
