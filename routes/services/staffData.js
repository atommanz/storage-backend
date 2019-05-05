

import sql from 'mssql'
import config from 'config'
import LogResetPassword from '../../models/logResetPassword'
import LogUnlock from '../../models/logUnlock'
import User from '../../models/users'

const getStaff = async (store, username, name) => {
    const dbconfig = {
        user: config.get('db.username'),
        password: config.get('db.password'),
        server: config.get(`host.${store}.servername`),
        database: config.get('db.database'),
        connectionTimeout: 300000,
        requestTimeout: 300000,
        pool: {
            idleTimeoutMillis: 300000,
            max: 10,
            min: 1,
            idle: 20000,
            evict: 20000,
            acquire: 20000,
        },
    }


    let queryWhere = ''
    if (username) {
        queryWhere += `where O.szSignOnName = '${username}' `
    }
    if (name) {
        if (username) { queryWhere += `and E.szEmplName LIKE '%${name}%'` }
        else { queryWhere += `where E.szEmplName LIKE '%${name}%'` }
    }
    console.log('queryWhere', queryWhere)
    const strQuery = `
    select
 E.lEmployeeID,E.szEmplName, isnull(O.szComment,'') as [Comment],
 isnull(O.szSignOnName,'') as [User ID],
 isnull(o.szEffectiveDate,'') as [Effective Date],
 isnull(o.szExpirationDate,'') as [Expiration Date],
 CASE WHEN E.szStatusCode = 'AC' THEN 'ACTIVE' ELSE 'INACTIVE' END as [User Status],
 O.szPasswordEffectiveDate as [Password Effective Date], 
 O.szPasswordExpirationDate as [Password Expire Date],
 O.lPasswordExpirationRange as [Password Expire Days],
 CASE WHEN O.bPasswordChangeFlag=-1 THEN 'Yes' ELSE 'No' END as [Force Password Change],
 isnull(OS.lWrongPasswordEntryCount,0) as [Wrong Password Count],
 isnull(OA.szLastUpdLocal,'') as [Last Active Date-Time],
 isnull(P.szName,'Sale Employee') as [Profile Name], isnull(P.szDescription,'') as [Profile Description]

from Employee E left outer join Operator O on E.lEmployeeID=O.lEmployeeID
 left outer join OperatorStatus OS on O.lOperatorID=OS.lOperatorID
 left outer join OperatorRetailStoreAffiliation OA on O.lOperatorID=OA.lOperatorID
 left outer join OperatorProfileAffiliation OP on O.lOperatorID=OP.lOperatorID
 left outer join [Profile] P on OP.lProfileID=P.lProfileID
${queryWhere}
    `

    console.log('strQuery', strQuery)
    const connectionPool = new sql.ConnectionPool(dbconfig)
    const connection = await connectionPool.connect()
    const outSQL = await connection.request().query(strQuery)
    connectionPool.close()
    console.log('out', outSQL.recordsets[0])
    return outSQL.recordsets[0]
}


const resetPassword = async (store, username, createdBy) => {

    try {
        // console.log('resetPassword', store, username, createdBy)
        const promiseUser = await User.findOne({ username: createdBy })

        const dbconfig = {
            user: config.get('db.username'),
            password: config.get('db.password'),
            server: config.get(`host.${store}.servername`),
            database: config.get('db.database'),
            connectionTimeout: 300000,
            requestTimeout: 300000,
            pool: {
                idleTimeoutMillis: 300000,
                max: 10,
                min: 1,
                idle: 20000,
                evict: 20000,
                acquire: 20000,
            },
        }
        

        const query1 = `update Operator set bPasswordChangeFlag=-1,
    szSignOnPasswordHash = 'uAZlE7ZRMYiiK40omkDtNHPTMCdQzBUvOA4xBeOv1GQ=',szSignOnPassword = 'pm01c/uwatU='
    where szSignOnName ='${username}'`

        const query2 = `update Employee set szStatusCode = 'AC' 
    Where lEmployeeID in (select e.lEmployeeID
    from operator as o, Employee as e
    where o.lEmployeeID = e.lEmployeeID
    and o.szsignonname ='${username}')`

    const query3 = `update OperatorStatus set lWrongPasswordEntryCount =0 where 
    lOperatorID in (select e.lEmployeeID
   from operator as o, Employee as e
   where o.lEmployeeID = e.lEmployeeID
   and o.szsignonname ='${username}')`

        const connectionPool = new sql.ConnectionPool(dbconfig)
        const connection = await connectionPool.connect()
        const outSQL1 = await connection.request().query(query1)
        logfn(username, 'Operator', 'success', promiseUser._id)
        const outSQL2 = await connection.request().query(query2)
        logfn(username, 'Employee', 'success', promiseUser._id)
        const outSQL3 = await connection.request().query(query3)
        logfn(username, 'OperatorStatus', 'success', promiseUser._id)
        

        connectionPool.close()
        // console.log('outSQL1', outSQL1)
        // console.log('outSQL2', outSQL2)
        return true


    }
    catch (e) {
        const promiseUser = await User.findOne({ username: createdBy })
        logfn(username, 'Operator | Employee', 'fail', promiseUser._id, e.originalError.info.message)
        return false
    }

}

const Unlock = async (store, username, createdBy) => {

    try {
        // console.log('resetPassword', store, username, createdBy)
        const promiseUser = await User.findOne({ username: createdBy })

        const dbconfig = {
            user: config.get('db.username'),
            password: config.get('db.password'),
            server: config.get(`host.${store}.servername`),
            database: config.get('db.database'),
            connectionTimeout: 300000,
            requestTimeout: 300000,
            pool: {
                idleTimeoutMillis: 300000,
                max: 10,
                min: 1,
                idle: 20000,
                evict: 20000,
                acquire: 20000,
            },
        }
       

        
        const query1 = `update Employee set szStatusCode = 'AC' 
        Where lEmployeeID in (select e.lEmployeeID
        from operator as o, Employee as e
        where o.lEmployeeID = e.lEmployeeID
        and o.szsignonname ='${username}')`

        const query2 =  `update OperatorStatus set lWrongPasswordEntryCount =0 where 
        lOperatorID in (select e.lEmployeeID
       from operator as o, Employee as e
       where o.lEmployeeID = e.lEmployeeID
       and o.szsignonname = '${username}')`

        const connectionPool = new sql.ConnectionPool(dbconfig)
        const connection = await connectionPool.connect()
        const outSQL1 = await connection.request().query(query1)
        logUnlockfn(username, 'OperatorStatus', 'success', promiseUser._id)
        const outSQL2 = await connection.request().query(query2)
        logUnlockfn(username, 'Employee', 'success', promiseUser._id)

        connectionPool.close()
        // console.log('outSQL1', outSQL1)
        // console.log('outSQL2', outSQL2)
        return true


    }
    catch (e) {
        const promiseUser = await User.findOne({ username: createdBy })
        logUnlockfn(username, 'Operator | Employee', 'fail', promiseUser._id, e.originalError.info.message)
        return false
    }



}

const logfn = async (username, table, status, createdBy, message) => {

    const PromiseLogResetPassword = new LogResetPassword({
        username: username,
        table: table,
        status: status,
        createdBy: createdBy,
        message: message
    })
    await PromiseLogResetPassword.save()
}

const logUnlockfn = async (username, table, status, createdBy, message) => {

    const PromiseLogUnlockfn = new LogUnlock({
        username: username,
        table: table,
        status: status,
        createdBy: createdBy,
        message: message
    })
    await PromiseLogUnlockfn.save()
}




export default {
    getStaff,
    resetPassword,
    Unlock
}

