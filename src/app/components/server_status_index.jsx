import React from 'react'
import { render } from 'react-dom'
import { Router, Route, Link } from 'react-router'
import {
    FlatButton,
    FontIcon,
    Dialog,
    Styles,
    Table,
    TableBody,
    TableFooter,
    TableHeader, 
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
    RaisedButton,
} from 'material-ui'

const { Colors } = Styles


class ServerStatusIndex extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            dialogOpen: false,
            serverStatus: "",
            isMount: false,
        }
        this._getServerStatus = this._getServerStatus.bind(this)
    }


    render() {
        return(
            <div>
                {this._getNewServerDialog()}
                <Table
                 selectable={false}
                 height='80%'>
                    {this._getTableHeader()}
                    {this._getTableBody()}
                    {this._getTableFooter()}
                </Table>
            </div>
        )
    }

    _handleDialogOpen = () => {
        this.setState({dialogOpen: true})
    }
  
    _handleDialogClose = () => {
        this.setState({dialogOpen: false})
    }

    _getNewServerDialog() {
        const actions = [
            <FlatButton
             label="Cancel"
             secondary={true}
             onTouchTap={this._handleDialogClose}
            />,
            <FlatButton
             label="Submit"
             primary={true}
             keyboardFocused={true}
             onTouchTap={this._handleDialogClose}
            />,
        ];

        return (
            <div>
                <RaisedButton label="NewServer" secondary={true} onTouchTap={this._handleDialogOpen} />
                <Dialog
                 title="New Server"
                 actions={actions}
                 modal={false}
                 open={this.state.dialogOpen}
                 onRequestClose={this._handleDialogClose}
                >
                <TextField
                 hintText="Hostname"
                 floatingLabelText="Hostname"
                /><br/>
                <TextField
                 hintText="IP Address"
                 floatingLabelText="IP Address"
                /><br/>
                <TextField
                 hintText="SSH Secret Key"
                 floatingLabelText="SSH Secret Key"
                 multiLine={true}
                 rows={5}
                />
                </Dialog>
            </div>
        )
    }

    _getTableHeader() {
        return (
            <TableHeader
             adjustForCheckbox={false}
             displaySelectAll={false}>
                <TableRow>
                    <TableHeaderColumn>#</TableHeaderColumn>
                    <TableHeaderColumn>Status</TableHeaderColumn>
                    <TableHeaderColumn>Hostname</TableHeaderColumn>
                    <TableHeaderColumn>IP Address</TableHeaderColumn>
                    <TableHeaderColumn>CPU Loads</TableHeaderColumn>
                    <TableHeaderColumn>Memory Usage</TableHeaderColumn>
                    <TableHeaderColumn>Disk Usage</TableHeaderColumn>
                    <TableHeaderColumn></TableHeaderColumn>
                </TableRow>
            </TableHeader>
        )
    }

    _getTableFooter() {
        return (
            <TableFooter></TableFooter>
        )
    }

    _getTableBody() {
        if (!this.state.isMount) {
            $.get(
                "/api/host/status",
                this._getServerStatus
            )
        }

        let tableBody = []

        if (this.state.isMount) {
            for (let key of Object.keys(this.state.serverStatus)) {
                let val = this.state.serverStatus[key]
                let linkToDetail = "/server/" + key.toString()
                let statusIconDict = {
                    "Active": <TableRowColumn><FontIcon className="material-icons" color={Colors.greenA400}>done</FontIcon></TableRowColumn>,
                    "Down": <TableRowColumn><FontIcon className="material-icons" color={Colors.red400}>error</FontIcon></TableRowColumn>,
                }
                let detailBtnDict = {
                    "Active": <TableRowColumn><Link to={linkToDetail}><RaisedButton label="Detail" secondary={true} /></Link></TableRowColumn>,
                    "Down":  <TableRowColumn><RaisedButton label="Detail" disabled={true} /></TableRowColumn>,
                }

                tableBody.push(
                    <TableRow key={key}>
                        <TableRowColumn>{key}</TableRowColumn>
                        {statusIconDict[val["Status"]]}
                        <TableRowColumn>{val["Hostname"]}</TableRowColumn>
                        <TableRowColumn>{val["IP"]}</TableRowColumn>
                        <TableRowColumn>{val["CPU Load"]}</TableRowColumn>
                        <TableRowColumn>{val["Memory Usage"][0]} / {val["Memory Usage"][1]} MB</TableRowColumn>
                        <TableRowColumn>{val["Disk Usage"][0]} / {val["Disk Usage"][1]} GB</TableRowColumn>
                        {detailBtnDict[val["Status"]]}
                    </TableRow>
                )
            }
        }

        return (
            <TableBody
             displayRowCheckbox={false}>
                {tableBody}
            </TableBody>
        )
    }

    _getServerStatus(data) {
        this.setState({serverStatus: data, isMount: true})
    }

}

export default ServerStatusIndex
