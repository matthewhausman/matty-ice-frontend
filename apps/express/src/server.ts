import express from 'express'
import { getMany } from './routes/users/getMany'
// Constants
const port = process.env.PORT || 5174

// Create http server
const app = express()

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})

app.get('/users', getMany)
