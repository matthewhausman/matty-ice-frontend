import express from 'express'
import { db } from '@matty-ice-app-template/db'
// Constants
const port = process.env.PORT || 5174

// Create http server
const app = express()

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
  console.log(process.env.API_URL)
})
