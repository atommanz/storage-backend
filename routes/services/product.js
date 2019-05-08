import firebase from 'firebase'
import moment from 'moment'

const findAll = async (query, status) => {
    console.log(query, status)
    const db = firebase.firestore()
    let collection;
    const listOut = []
    if (query) { collection = await db.collection('storage').where("category", "==", query).get() }
    else { collection = await db.collection('storage').get() }
    const listProduct = collection.docs.map(
        (val) => {
            const objOut = val.data()
            objOut._id = val.id
            listOut.push(objOut)
        }
    )

    await Promise.all(listProduct)
    if (status) {
        const promFilter = listOut.filter((member) => {
            return member.status === status
        })
        await Promise.all(promFilter)
        return promFilter
    }
    else {
        return listOut
    }
}

const findOne = async (id) => {
    var db = firebase.firestore()
    var docRef = db.collection("storage").doc(id)

    const doc = await docRef.get()
    if (doc.data()) {
        return doc.data()
    }
    else {
        return {}
    }
}

const create = async (body) => {
    var db = firebase.firestore()
    const docRef = await db.collection("storage").add(body)
    return docRef.id
}

const checkout = async (id, endDate, totalPrice) => {
    console.log(id, endDate)
    var db = firebase.firestore()
    var docRef = db.collection("storage").doc(id)
    docRef.update({
        endDate,
        status: 'I',
        totalPrice
    })
    const doc = await docRef.get();
    return doc.data()
}

const getPrice = async (body) => {

    let price = 0
    if (body.category === 'food') {
        price = await getPriceFood(body)
    }
    else if (body.category === 'clothes') {
        price = await getPriceClothes(body)
    }
    else if (body.category === 'etc') {
        price = await getPriceEtc(body)
    }
    return price.toFixed(2)
}

const getPriceFood = async (body) => {
    const diffDate = await findDiffDate(body.startDate, body.endDate)
    console.log('diffDate', diffDate)
    const volume = Number(body.width) * Number(body.height) * Number(body.depth)
    let price = volume
    let totalPrice = price
    var i
    for (i = 2; i <= diffDate; i++) {
        price = price * 2
        console.log(i, price)
        totalPrice += price
    }
    console.log(totalPrice)
    return totalPrice
}

const getPriceClothes = async (body) => {
    const diffDate = await findDiffDate(body.startDate, body.endDate)
    console.log('diffDate', diffDate)
    let volume = Number(body.width) * Number(body.height) * Number(body.depth) //cm3
    volume = volume * Math.pow(10, -6) //convert unit cm3 to m3
    if (body.weight) {
        const totalPrice = Number(body.weight) * diffDate * 20
        return totalPrice
    }
    else {
        //  D=m/v
        console.log('volume', volume)
        const weight = 100 * volume  //KG.
        const totalPrice = Number(weight) * diffDate * 20
        return totalPrice
    }
}

const getPriceEtc = async (body) => {
    const diffDate = await findDiffDate(body.startDate, body.endDate)

    let volume = Number(body.width) * Number(body.height) * Number(body.depth) //cm3
    volume = volume * Math.pow(10, -6) //convert unit cm3 to m3
    console.log('diffDate', diffDate, 'volume', volume)
    const totalPrice = volume * diffDate * 10
    return totalPrice
}

const findDiffDate = async (inpStartDate, inpEndDate) => {

    const startDate = moment(inpStartDate, "DD/MM/YYYY HH:mm:ss")
    const endDate = moment(inpEndDate, "DD/MM/YYYY HH:mm:ss")
    const diffSecond = endDate.diff(startDate, 'seconds')
    const days = Math.ceil(Number(diffSecond) / (60 * 60 * 24))
    return days
}
export default {
    findAll,
    findOne,
    create,
    checkout,
    getPrice
}

