interface some {
    [propName: string]: any;
}
declare const animate: (object: some, time: number, to: some, loop?: boolean) => Promise<unknown>;
export { animate };
