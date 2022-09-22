import { Observable, Observer } from "rxjs";
import { Course } from "../model/course";

export const observableHttpRequest = (url: string): Observable<any> => {
  const controllers = new AbortController();
  const signal = controllers.signal;
  return new Observable((observer: Observer<any>) => {
    fetch(url, { signal })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          observer.error("Request failed with status code: " + res.status);
          // throw Error("Request failed with status code: " + res.status);
        }
      })
      .then((data) => {
        observer.next(data);
        observer.complete();
      })
      .catch((err) => {
        observer.error(err.message);
      });
  });
};
