import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import one from './App.css?inline'
import two from './index.css?inline'

// const allStyles = [indexStyles, appStyles]

// const joined = allStyles.join('')

ReactDOM.hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <React.StrictMode>
    <style
      key="matty-ice-css"
      dangerouslySetInnerHTML={{
        __html: [one, two].join('\n'),
      }}
    />
    <App />
  </React.StrictMode>,
)
