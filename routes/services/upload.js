import fs from 'fs'
import excelToJson from 'convert-excel-to-json'
// import node_xj from 'xls-to-json'

const resourceDIR = 'resources'
const resourcExcelDIR = 'resources/excel'

const excel2json = async excel => new Promise(async (resolve, reject) => {
    try {
        const convertJson = await excelToJson({
            source: excel.data,
            columnToKey: {
                A: 'no',
                B: 'employeeId',
                C: 'name',
                D: 'position',
                E: 'department',
                F: 'role',
                G: 'store',
                H: 'effectiveDate',
                I: 'remark',
                J: 'resignationDate',
                K: 'storeSource',
                L: 'requestId'
            }
        })
        // console.log(convertJson)
        return resolve(convertJson)

    }
    catch (e) {
        console.error(e)
    }

})

const json2NewFormat = async json => new Promise(async (resolve, reject) => {
    try {
        const Sheet1 = json.Sheet1
        // console.log('jjj', Sheet1)
        let data = []
        Sheet1.map((currentData, index) => {
            console.log(currentData, index)
            if (index > 1 && currentData.employeeId && currentData.name && currentData.position) {
                data.push(currentData)
            }
        })
        // console.log('daaaa', data)
        return resolve(data)

    }
    catch (e) {
        console.error(e)
    }

})

export default {
    excel2json,
    json2NewFormat,
}

