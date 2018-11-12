export const transferData = ((from: any[], to: any[], num: number) => {
    for (let i = 0; i < num; i++) {
        to.push(from.shift());
    }
});
