import React from 'react'
import { RequestHandler } from 'express'
import { renderToStaticMarkup, renderToString } from 'react-dom/server'
import { StaticRouter, StaticContext } from 'react-router'
import { ChunkExtractor } from '@loadable/server'
import path from 'path'
import { App } from '../app'

const statsFile = path.resolve(__dirname, '../client/loadable-stats.json')

export const ssr = (): RequestHandler => (req, res, next) => {
    const extractor = new ChunkExtractor({ statsFile })
    const context: StaticContext = {}

    const app = renderToString(
        extractor.collectChunks(
            <StaticRouter location={req.url} context={context}>
                <App />
            </StaticRouter>
        )
    )

    const html = renderToStaticMarkup(
        <html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Document</title>
                {extractor.getLinkElements()}
            </head>
            <body>
                <div id="app" dangerouslySetInnerHTML={{ __html: app }} />
                {extractor.getStyleElements()}
                {extractor.getScriptElements()}
            </body>
        </html>
    )

    if (context.statusCode) {
        res.status(context.statusCode)
    } else {
        res.status(200)
    }

    return res.send('<!DOCTYPE html>' + html)
}
