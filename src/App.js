import react, { useState, useEffect } from "react";
import "./App.css";
import { of, interval, concat, Subject, noop } from "rxjs";
import {
    takeWhile,
    takeUntil,
    scan,
    startWith,
    repeatWhen,
    share,
    filter,
    tap,
} from "rxjs/operators";
const countdown$ = interval(250).pipe(
    startWith(5),
    scan((time) => time - 1),
    takeWhile((time) => time > 0),
    share()
);

const actions$ = new Subject();
const snooze$ = actions$
    .pipe(filter((action) => action === "snooze"))
    .pipe(tap((x) => console.log(x)));
const dismiss$ = actions$.pipe(filter((action) => action === "dismiss"));
const snoozableAlarm$ = concat(countdown$, of("Được rồi đi thôi!")).pipe(
    repeatWhen(() => snooze$)
);

const observable$ = concat(
    snoozableAlarm$.pipe(takeUntil(dismiss$)),
    of("Đã dậy")
);
function App() {
    const [state, setState] = useState();

    useEffect(() => {
        const sub = observable$.subscribe(setState, noop, () =>
            console.log("complete")
        );
        return () => sub.unsubscribe();
    }, []);
    return (
        <>
            <h3>Alarm Clock</h3>
            <div className="display">{state}</div>
            <button className="snooze" onClick={() => actions$.next("snooze")}>
                Snooze
            </button>
            <button
                className="dismiss"
                onClick={() => actions$.next("dismiss")}
            >
                Dismiss
            </button>
        </>
    );
}

export default App;
