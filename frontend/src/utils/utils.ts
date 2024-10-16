export function delayPromise<T>(promise: Promise<T>, minDelay = 1000): Promise<T> {
    const delayPromise = new Promise<void>((resolve) => {
        setTimeout(() => resolve(), minDelay);
    });

    return Promise.all([promise, delayPromise]).then(([result]) => result);
}