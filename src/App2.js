import React, { useEffect } from "react";
import { fromEvent, interval } from "rxjs";
import { map, take, switchMap } from "rxjs/operators";

const ob = interval(500).pipe(take(3));

const observer = {
    next: (x) => console.log(x),
    error: (err) => console.error("Observer got an error: " + err),
    complete: () => console.log("Observer got a complete notification"),
};

const click$ = fromEvent(document, "click").pipe(take(5));

const App2 = () => {
    useEffect(() => {
        const sub = click$
            .pipe(
                switchMap(() => {
                    console.log("clicked");
                    return ob;
                })
            )
            .subscribe(observer);

        return () => sub.unsubscribe();
    }, []);

    return <div>App2</div>;
};

export default App2;
