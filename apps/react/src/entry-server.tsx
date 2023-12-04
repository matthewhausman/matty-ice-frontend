import React from 'react'
import ReactDOMServer from 'react-dom/server'
import App from './App'
import one from './App.css?inline'
import two from './index.css?inline'

export function render() {
  const html = ReactDOMServer.renderToString(
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
  return { html }
}
