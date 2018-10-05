import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { groceriesRouting } from "./groceries.routing";
import { GroceriesComponent } from "./groceries.component";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";

@NgModule({
    imports: [
        NativeScriptFormsModule,
        NativeScriptCommonModule,
        groceriesRouting,
        NativeScriptUIListViewModule
    ],
    declarations: [
        GroceriesComponent
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class GroceriesModule { }
