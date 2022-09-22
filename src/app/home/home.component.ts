import { Component, OnInit } from "@angular/core";
import { Course } from "../model/course";
import {
  catchError,
  delayWhen,
  finalize,
  map,
  pluck,
  retryWhen,
  shareReplay,
  tap,
} from "rxjs/operators";
import { Observable, of, throwError, timer } from "rxjs";
import { observableHttpRequest } from "../common/util";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  public beginnerCourses$: Observable<Course[]>;
  public advancedCourses$: Observable<Course[]>;
  constructor() {}

  ngOnInit() {
    const http$ = observableHttpRequest("/api/courses").pipe(
      tap(() => console.log("HTTP request executed")),
      // tap is used to log the http request as a side effect of the observable stream
      map((res) => res["payload"]), // map is used to transform the response from the server into the desired format
      // pluck("payload"), // pluck is used to extract the payload from the response from the server it works similar to map but it only extracts the payload from the response
      tap(console.log),
      // shareReplay is used to cache the response from the server so that it can be used by multiple subscribers
      shareReplay(),
      retryWhen((errors) =>
        errors.pipe(
          delayWhen(() => {
            return timer(2000);
          })
        )
      )
    );

    this.beginnerCourses$ = http$.pipe(
      map((courses: []) =>
        courses.filter(
          (course: { category: string }) => course.category === "BEGINNER"
        )
      )
    );

    this.advancedCourses$ = http$.pipe(
      map((courses: []) =>
        courses.filter(
          (course: { category: string }) => course.category === "ADVANCED"
        )
      )
    );
  }
}
