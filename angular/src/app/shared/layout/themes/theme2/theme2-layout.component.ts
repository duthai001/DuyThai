import { Injector, ElementRef, Component, OnInit, AfterViewInit, ViewChild, Inject } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ThemesLayoutBaseComponent } from '@app/shared/layout/themes/themes-layout-base.component';
import { UrlHelper } from '@shared/helpers/UrlHelper';
import { DOCUMENT } from '@angular/common';
import { LayoutRefService } from '@metronic/app/core/_base/layout/services/layout-ref.service';
import { AppConsts } from '@shared/AppConsts';
import { BookAppserviceServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
    templateUrl: './theme2-layout.component.html',
    selector: 'theme2-layout',
    animations: [appModuleAnimation()]
})
export class Theme2LayoutComponent extends ThemesLayoutBaseComponent implements OnInit, AfterViewInit {

    @ViewChild('ktHeader', {static: true}) ktHeader: ElementRef;
    userId: number;
    constructor(
        injector: Injector,
    private layoutRefService: LayoutRefService,
        private _book: BookAppserviceServiceProxy,
        @Inject(DOCUMENT) private document: Document
    ) {
        super(injector);
    }

    remoteServiceBaseUrl: string = AppConsts.remoteServiceBaseUrl;

    ngOnInit() {
        this.installationMode = UrlHelper.isInstallUrl(location.href);
        this.getUserLogin();
    }
    getUserLogin() {
        this._book.getUser().subscribe(re => {
            this.userId = re;
            console.log(this.userId);
        });
    }

    ngAfterViewInit(): void {
        this.layoutRefService.addElement('header', this.ktHeader.nativeElement);
    }

    toggleLeftAside(): void {
        this.document.body.classList.toggle('kt-header-menu-wrapper--on');
        this.document.getElementById('kt_header_menu_wrapper').classList.toggle('kt-header-menu-wrapper--on');
    }
}
