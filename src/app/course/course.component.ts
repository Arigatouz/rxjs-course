import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Course } from "../model/course";
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay,
  map,
  concatMap,
  switchMap,
  withLatestFrom,
  concatAll,
  shareReplay,
} from "rxjs/operators";
import { merge, fromEvent, Observable, concat } from "rxjs";
import { Lesson } from "../model/lesson";
import { observableHttpRequest } from "../common/util";

@Component({
  selector: "course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.css"],
})
export class CourseComponent implements OnInit, AfterViewInit {
  course$: Observable<Course>;

  lessons$: Observable<Lesson[]>;

  @ViewChild("searchInput", { static: true }) searchInput: ElementRef;
  constructor(private route: ActivatedRoute) { }
  courseId: string;
  ngOnInit() {
    this.courseId = this.route.snapshot.params["id"];
    this.course$ = observableHttpRequest(`api/courses/${this.courseId}`);
  }

  ngAfterViewInit() {
    const searchLessons$ = fromEvent<any>(
      this.searchInput.nativeElement,
      "keyup"
    ).pipe(
      map((event) => event.target.value),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((search) => this.lessonsLoad(search))
    );
    const initialLessons$ = this.lessonsLoad();
    this.lessons$ = concat(initialLessons$, searchLessons$);
  }

  lessonsLoad(search: string = ""): Observable<Lesson[]> {
    return observableHttpRequest(
      `api/lessons/?courseId=${this.courseId}&pageSize=100&filter=${search}`
    ).pipe(map((res) => res["payload"]));
  }
}
