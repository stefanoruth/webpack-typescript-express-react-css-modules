import React from 'react'
import styles from './home.scss'
import { Layout } from '../../components'
import Image from '../../../assets/img1.jpg'

export const Home: React.FunctionComponent = props => {
    return (
        <Layout>
            <div className={styles.wrapper}>Hello World</div>
            <img src={Image.src} srcSet={Image.srcSet} width={500} />
        </Layout>
    )
}

export default Home
