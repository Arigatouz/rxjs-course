import { Observable, Observer } from "rxjs";

export const observableHttpRequest = (url: string): Observable<Promise<{}>> => {
  return new Observable((observer: Observer<Promise<{}>>) => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        observer.next(data);
        observer.complete();
      })
      .catch((err) => {
        observer.error(err);
      });
  });
};
