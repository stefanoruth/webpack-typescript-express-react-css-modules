import React from 'react'
import { Link } from 'react-router-dom'

export const Layout: React.FunctionComponent = props => {
    return (
        <div>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/about">About</Link>
                </li>
                <li>
                    <Link to="/404">404</Link>
                </li>
            </ul>
            <div>{props.children}</div>
        </div>
    )
}
