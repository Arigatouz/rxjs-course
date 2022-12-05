import { Observable, Observer } from "rxjs";


export const observableHttpRequest = (url: string): Observable<any> => {
  const controllers = new AbortController();
  const signal = controllers.signal;
  return new Observable((observer: Observer<any>) => {
    fetch(url, { signal })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          observer.error("Request failed with status code: " + response.status);
          // throw Error("Request failed with status code: " + response.status);
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
