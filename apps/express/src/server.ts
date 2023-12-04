import express from 'express'
import { getManyUsers } from './routes/users/getMany'
// Constants
import cors from 'cors'
const port = process.env.PORT || 5174

// Create http server
const app = express()

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})

app.use(
  cors({
    origin: '*',
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  }),
)

app.get('/users', getManyUsers)
