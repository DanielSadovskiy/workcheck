export class Session {
    readonly name: string;
    readonly expiresAt: Date;
    
    constructor(name: string, expiresAt: Date) {
        this.name = name
        this.expiresAt = expiresAt
    }

    isExpired() : boolean {
        return this.expiresAt < (new Date())
    }

    getSession() {
        return { 
            name: this.name,
            expiresAt: this.expiresAt
        }
    }
}

interface ISessionStorage {
    [key: string] : Session
}

export const sessions:ISessionStorage = {}
