import { Component, OnInit } from "@angular/core";
import { Course } from "../model/course";
import {
  catchError,
  delayWhen,
  filter,
  map,
  retryWhen,
  shareReplay,
  tap,
} from "rxjs/operators";
import {
  Observable,
  fromEvent,
  timer,
  Observer,
  noop,
  of,
  interval,
} from "rxjs";
import { observableHttpRequest } from "../common/util";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  public beginnerCourses: Course[];
  public AdvancedCourses: Course[];
  constructor() {}

  ngOnInit() {
    const http$ = observableHttpRequest("/api/courses");
    const courses$ = http$.pipe(map((res) => Object.values(res["payload"])));

    courses$.subscribe(
      (courses: Course[]) => {
        this.beginnerCourses = courses.filter(
          (course) => course?.category === "BEGINNER"
        );
        this.AdvancedCourses = courses.filter(
          (course) => course?.category === "ADVANCED"
        );
      },
      noop, //noop is a function that does nothing and returns void and is used to avoid errors when no error is thrown in the observable
      () => console.log(this.beginnerCourses, this.AdvancedCourses)
    );
  }
}
