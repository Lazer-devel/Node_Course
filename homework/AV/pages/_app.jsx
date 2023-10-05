import Layout from '../components/Layout/Layout'
import AuthProvider from '../hoc/AuthProvider'

import '../styles/global.scss'

const MyApp = ({ Component, pageProps }) => (
  <AuthProvider>
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </AuthProvider>
)

export default MyApp
