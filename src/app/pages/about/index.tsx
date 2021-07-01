import React from 'react'
import { Layout } from '../../components'
import Logo from '../../../assets/logo.svg'

export const About: React.FunctionComponent = props => {
    return (
        <Layout>
            <div>About</div>
            <img src={Logo} alt="logo" />
        </Layout>
    )
}

export default About
