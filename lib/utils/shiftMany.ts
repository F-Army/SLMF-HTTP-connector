export const shiftMany = (arr: any[], num: number) => {
    for (let i = 0; i < num; i++) {
        arr.shift();
    }
};
