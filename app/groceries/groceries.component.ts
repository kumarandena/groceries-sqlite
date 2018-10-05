import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { TextField } from "tns-core-modules/ui/text-field";
import { ListViewEventData, RadListView } from "nativescript-ui-listview";
import { View } from "tns-core-modules/ui/core/view";
import { getString } from "application-settings";
import { alert, LoginService, User } from "../shared";
import { DatabaseService } from "../database/sqlite.service"; 

@Component({
	selector: "Groceries",
	moduleId: module.id,
	templateUrl: "./groceries.component.html",
	styleUrls: ['./groceries.component.css']
})
export class GroceriesComponent implements OnInit {
	groceryList: Array<Object> = [];
	db: any;
	grocery = "";
	user_id: string;
	@ViewChild("groceryTextField") groceryTextField: ElementRef;

	constructor(
		private routerExtensions: RouterExtensions,
		private userService: LoginService,
		private database: DatabaseService
	) {
		this.user_id = getString("user_id");
	}

	ngOnInit(): void {
		this.selectItems();
	}

	selectItems() {
		this.groceryList = [];
		this.database.getdbConnection()
			.then(db => {
				db.all("SELECT id, item_name FROM items WHERE user_id = ?", [this.user_id]).then(rows => {
					for (var row in rows) {
						this.groceryList.push({ id: rows[row][0], name: rows[row][1] });
					}
					this.db = db;
				}, error => {
					console.log("SELECT ERROR", error);
				});
			});
	}

	logout() {
		this.userService.logout();
		this.routerExtensions.navigate(["/login"]);
	}
	
	add() {
		if (this.grocery.trim() === "") {
			alert("Enter a grocery item");
			return;
		}

		let textField = <TextField>this.groceryTextField.nativeElement;
		textField.dismissSoftInput();

		this.db.execSQL("INSERT INTO items (item_name, user_id) VALUES (?,?)", [this.grocery, this.user_id]).then(id => {
			this.groceryList.unshift({ id: id, name: this.grocery });
			this.grocery = "";
		}, error => {
			alert('An error occurred while adding an item to your list.');
			this.grocery = "";
		});

	}
	onSwipeCellStarted(args: ListViewEventData) {
		var swipeLimits = args.data.swipeLimits;
		var swipeView = args.object;
		var rightItem = swipeView.getViewById<View>("delete-view");
		swipeLimits.right = rightItem.getMeasuredWidth();
		swipeLimits.left = 0;
		swipeLimits.threshold = rightItem.getMeasuredWidth() / 2;
	}

	delete(args: ListViewEventData) {
		let grocery = <any>args.object.bindingContext;
		this.db.execSQL("DELETE FROM items WHERE id=?", [grocery.id]).then(() => {
			let index = this.groceryList.indexOf(grocery);
			this.groceryList.splice(index, 1);
			console.log(" Item deleted successfully!")
		});

	}
}