import { Observable, Observer } from "rxjs";
import { Course } from "../model/course";

export const observableHttpRequest = (url: string): Observable<Course> => {
  return new Observable((observer: Observer<any>) => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        observer.next(data);
        observer.complete();
      })
      .catch((err) => {
        observer.error(err.message);
      });
  });
};
