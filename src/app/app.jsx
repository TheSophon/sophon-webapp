import React from 'react'
import { render } from 'react-dom'
import { browserHistory, IndexRoute, Router, Route, Link } from 'react-router'
import injectTapEventPlugin from 'react-tap-event-plugin'
import Master from './components/master'
import Login from './components/login'
import ServerStatus from './components/server_status'
import ServerStatusIndex from './components/server_status_index'
import ServerStatusDetail from './components/server_status_detail'
import SSHPermission from './components/ssh_permission'
import DockersStatus from './components/dockers_status'
import Deploy from './components/deploy'
import DeployIndex from './components/deploy_index'
import DeployDetail from './components/deploy_detail'


injectTapEventPlugin()


function requireAuth(nextState, replaceState) {
    $.ajax({
        type: "GET",
        url: "/api/user/info",
        async: false,
        success: function (data) {
            if (!data.hasOwnProperty("id")) {
                replaceState({}, "/login")
            }
        },
    })
}


render((
  <Router history={browserHistory}>
    <Route path="/" component={Master}>
        <Route path="login" component={Login} />
        <Route path="server" component={ServerStatus} onEnter={requireAuth}>
            <IndexRoute component={ServerStatusIndex} />
            <Route path=":id" component={ServerStatusDetail}/>
        </Route>
        <Route path="deploy" component={Deploy} onEnter={requireAuth}>
            <IndexRoute component={DeployIndex} />
            <Route path=":id" component={DeployDetail} />
        </Route>
        <Route path="ssh_permission" component={SSHPermission} onEnter={requireAuth}/>
        <Route path="dockers_status" component={DockersStatus} onEnter={requireAuth}/>
    </Route>
  </Router>
), document.getElementById('app'))
