import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Observable, fromEvent, timer } from "rxjs";
@Component({
  selector: "about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"],
})
export class AboutComponent implements OnInit {
  private _click: Observable<Event>;
  constructor() {}

  ngOnInit() {
    this._click = fromEvent(document, "click");
    this._click.subscribe((event) => {
      console.log(event);
    });
  }
}
