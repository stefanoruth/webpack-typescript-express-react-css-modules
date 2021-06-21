import React from 'react'
import { useLocation, Route } from 'react-router-dom'
import { Layout } from '../../components'

export const Status404: React.FunctionComponent = () => {
    const location = useLocation()

    return (
        <Layout>
            <Route
                render={({ staticContext }) => {
                    if (staticContext) {
                        staticContext.statusCode = 404
                    }

                    return <div>404 - {location.pathname}</div>
                }}
            />
        </Layout>
    )
}

export default Status404
