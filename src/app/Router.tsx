import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Home, About, Status404 } from './pages'

export const Router: React.FunctionComponent = () => {
    return (
        <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/about" exact component={About} />
            <Route component={Status404} />
        </Switch>
    )
}
