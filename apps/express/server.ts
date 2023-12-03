import express from 'express'

// Constants
const port = process.env.PORT || 5174

// Create http server
const app = express()

app.use('*', async (req, res) => {})

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
