export const matchParse = (url:string):string => {
    const domain = new URL(url).origin;
    return `${domain}/**/*`
}