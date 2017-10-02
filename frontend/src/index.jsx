import React from 'react'
import {render} from 'react-dom'
import {createNetworkInterface, ApolloClient, ApolloProvider} from 'react-apollo'
import App from './App'

const client = new ApolloClient({
    dataIdFromObject: o => o.id ,
    networkInterface: createNetworkInterface({
        uri: 'http://127.0.0.1:8080/graphql/',
    })
})

const Root = (props) => (
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
)

render(<Root/>, document.getElementById('root'))