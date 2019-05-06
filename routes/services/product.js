import firebase from 'firebase'

const findAll = async (query, status) => {
    console.log(query, status)
    const db = firebase.firestore()
    let collection;
    const listOut = []
    if (query) { collection = await db.collection('storage').where("category", "==", query).get() }
    else { collection = await db.collection('storage').get() }
    // collection.docs.map(doc => { 
    //     console.log(doc.id, " => ", doc.data()) 
    // })
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
    else{
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

const checkout = async (id, endDate) => {
    var db = firebase.firestore()
    var docRef = db.collection("storage").doc(id)

    const doc = await docRef.get()

    return doc.data()
}


export default {
    findAll,
    findOne,
    create,
    checkout
}

