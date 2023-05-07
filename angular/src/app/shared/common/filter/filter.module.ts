import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SearchFilterPipe } from "./filter-pipe";
import { ClickOutsideDirective } from "./click-outside-directive";


@NgModule({
    imports: [CommonModule],
    providers: [],
    declarations: [SearchFilterPipe, ClickOutsideDirective],
    exports: [SearchFilterPipe, ClickOutsideDirective],
})
export class FilterModule {}
