import Professor from "./Professor"

const initProfessors = [
    {
        name: "Admin",
        password: "admin123",
        policies: ['https://www.geeksforgeeks.org/**/*', 'https://www.google.com/**/*']
    }
]

export const seedProfessors = async () => {
    await Professor.deleteMany({})
    await Professor.insertMany(initProfessors)
}


