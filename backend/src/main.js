import * as http from 'http'
import * as fs from 'fs'
import * as gql from 'graphql'

const schema = gql.buildSchema(`
    type User {
        id: ID
        name: String
    }

    type Query {
        user(id: ID): User
        allUsers: [User]
    }

    type Mutation {
        addUser(name: String): User
        updateUser(id: ID, name: String): User
    }
`)

const db = [
    { id: '0', name: 'alice' },
    { id: '1', name: 'bob' },
]

const root = {
    user: ({id}) => {
        console.log('id', typeof id)
        return db.find(x => x.id === id)
    },
    allUsers: () => db,
    addUser: ({name}) => {
        db.push({ id: db.length.toString(), name })
        return db[db.length - 1]
    },
    updateUser: ({id, name}) => {
        const user = db.find(x => x.id === id)
        user.name = name
        return user
    }
}

async function getConfig() {
    const configPath = process.argv[2]
    if (configPath === undefined) {
        console.log('Usage: main <config>')
        process.exit()
    }
    return new Promise((resolve, reject) => {
        fs.readFile(configPath, (error, data) => {
            if (error) {
                reject(error)
            }
            try {
                resolve(JSON.parse(data))
            }
            catch (error) {
                reject(error)
            }
        })
    })
}

async function start({NODE_PORT, NODE_HOSTNAME}) {
    const server = http.createServer((req, res) => {
        console.log(`${req.method} ${req.url}`)

        if (req.method === 'OPTIONS') {
            var headers = {};
            headers["Access-Control-Allow-Origin"] = "*"
            headers['Access-Control-Allow-Methods'] = 'HEAD, GET, POST, PUT, PATCH, DELETE, OPTIONS'
            headers["Access-Control-Allow-Credentials"] = false
            headers["Access-Control-Max-Age"] = '86400'; // 24 hours
            headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
            res.writeHead(200, headers)
            res.end()
        }
        else if (req.method === 'POST') {
            const chunks = []
            req.on('data', chunk => {
                chunks.push(chunk)
            })
            req.on('end', () => {
                var body = JSON.parse(chunks.join(''))
                var headers = {}
                headers['Content-Type'] = 'application/json'
                res.writeHead(200, headers)
                gql.graphql(schema, body.query, root, undefined, body.variables)
                    .then(x => {
                        res.end(JSON.stringify(x))
                    })
                    .catch(x => {
                        res.end(JSON.stringify({errors: [x]}))
                    })
            })
        }
        else {
            res.writeHead(200)
            res.end()
        }
    })
    server.listen(NODE_PORT, NODE_HOSTNAME, () => {
        console.log(`Server running at http://${NODE_HOSTNAME}:${NODE_PORT}/`)
    })
}

async function main() {
    try {
        start(await getConfig())
    }
    catch (error) {
        console.log(error)
    }
}

main()