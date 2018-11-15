export const convertToHexBinary = (num: number | undefined): string | undefined => {
    if (num === undefined) {
        return undefined;
    }
    const hexbin = num.toString(16);

    return hexbin.length % 2 !== 0 ? `0${hexbin}` : hexbin;
};
