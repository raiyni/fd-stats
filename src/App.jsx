import './App.css'

import { Layout, Menu } from 'antd'
import {
  NavLink,
  Redirect,
  Route,
  HashRouter as Router,
  Switch
} from 'react-router-dom'

import React from 'react'
import Standings from 'pages/standings'
import Transactions from 'pages/transactions'

const { Header, Content, Footer } = Layout

function App() {
  return (
    <Router>
      <Layout style={{ height: '100vh' }} className="layout">
        <Header>
          <span
            style={{
              float: 'left',
              color: 'white',
              fontSize: '1.5em',
              marginRight: '10px'
            }}
          >
            Fantasy Dutchmen
          </span>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
            <Menu.Item key="standings">
              <NavLink to={{ pathname: '/standings' }}> Standings </NavLink>
            </Menu.Item>
            <Menu.Item key="transactions">
              <NavLink to={{ pathname: '/transactions' }}>
                {' '}
                Transactions{' '}
              </NavLink>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '50px' }}>
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/standings" />} />
            <Route path="/standings">
              <Standings />
            </Route>
            <Route path="/transactions">
              <Transactions />
            </Route>
          </Switch>
        </Content>
        <Footer style={{ textAlign: 'center' }}></Footer>
      </Layout>
    </Router>
  )
}

export default App
