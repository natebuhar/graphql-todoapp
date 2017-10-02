import React, {Component} from 'react'
import {gql, graphql} from 'react-apollo'

const AppItemQuery = gql`
    query User($id: ID!) {
        user(id: $id) {
            id
            name
        }
    }`

const AppItemMutation = gql`
    mutation UpdateUser($id: ID!, $name: String!) {
        updateUser(id: $id, name: $name) {
            id
            name
        }
    }`

class AppItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: ''
        }
    }

    onNameChange(e) {
        this.setState({name: e.target.value})
    }

    onUpdateClick() {
        this.props.mutate({
            variables: {id: this.props.id, name: this.state.name},
            refetchQueries: [{query: AppQuery}]
        })
    }

    render() {
        if (this.props.data.loading) {
            return <li>Loading...</li>
        }
        else {
            const {user} = this.props.data
            return (
                <li>
                    <span>{user.name}</span>
                    <input onChange={this.onNameChange.bind(this)} placeholder={user.name} />
                    <input onClick={this.onUpdateClick.bind(this)} type="button" value="Update" />
                </li>
            )
        }
    }
}

const AppItemWithQuery = graphql(AppItemQuery, {
    options: ({ id }) => ({ variables: { id } }),
})(AppItem)

const AppItemWithMutation = graphql(AppItemMutation)(AppItemWithQuery)

const AppQuery = gql`
    query {
        allUsers {
            id
            name
        }
    }`

const AppMutation = gql`
    mutation AddUser($name: String!) {
        addUser(name: $name) {
            id
            name
        }
    }`

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: ''
        }
    }

    onUsernameChange(e) {
        this.setState({name: e.target.value})
    }

    onCreateClick() {
        this.props.mutate({
            variables: {name: this.state.name},
            refetchQueries: [{query: AppQuery}]
        })
        .then(({data}) => {
            console.log('success:', data)
        })
        .catch(error => {
            console.log('error:', error)
        })
    }

    render() {
        console.log(this.props.data)
        if (this.props.data.loading) {
            return <div>Loading...</div>
        }
        else {
            const {allUsers} = this.props.data
            return (
                <div>
                    <ul>
                        {allUsers.map(x => <AppItemWithMutation key={x.id} id={x.id} />)}

                        {/*this.props.data.allUsers.map(x => <li key={x.id}>{`${x.id} ${x.name}`}</li>)*/}
                    </ul>
                    <input value={this.state.username} onChange={this.onUsernameChange.bind(this)} />
                    <input value="Create" onClick={this.onCreateClick.bind(this)} type="button" />
                </div>
            )
        }
    }
}

// const AppWithQuery = graphql(AppQuery, {
//     options: ({id}) => ({ variables: {id} })
// })(App)

const AppWithQuery = graphql(AppQuery)(App)
const AppWithMutation = graphql(AppMutation)(AppWithQuery)
export default AppWithMutation