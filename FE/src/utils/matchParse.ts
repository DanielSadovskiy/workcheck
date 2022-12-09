export const matchParse = (url:string):string => {
    const domain = new URL(url).origin;
    return `${domain}/**/*`
}

export const isValidURL = (url: string) => {
    try {
        new URL(url);
        return true
    } catch(e){
        return false
    }
}