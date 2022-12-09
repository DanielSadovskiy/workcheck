import { Footer } from '../Footer/Footer';
import { Header } from '../Header/Header';
import styles from './styles.module.css';
interface Props {
    children: React.ReactNode
}

export const Layout: React.FunctionComponent<Props> = (props: Props) => {
    return (<div className={styles.layoutContainer}>
        <Header/>
        <main className={styles.pageContent}>
            {props.children}
        </main>
        <Footer/>
    </div>)
}