import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { loadableReady } from '@loadable/component'
import { App } from '../app'

loadableReady(() => {
    render(
        <BrowserRouter>
            <App />
        </BrowserRouter>,
        document.getElementById('app'),
        () => {
            console.log('React rendered')
        }
    )
})
