import { Component, OnInit } from "@angular/core";
import { Course } from "../model/course";
import { map, pluck, shareReplay, tap } from "rxjs/operators";
import { Observable } from "rxjs";
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
      tap(() => console.log("http request executed")), // tap is used to log the http request as a side effect of the observable stream
      // map((res) => res["payload"]), // map is used to transform the response from the server into the desired format
      pluck("payload"), // pluck is used to extract the payload from the response from the server it works similar to map but it only extracts the payload from the response
      shareReplay()
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
