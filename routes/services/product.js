import firebase from 'firebase'

const findAll = async (query) => {
    const db = firebase.firestore()
    let collection;
    const listOut = []
    if (query) { collection = await db.collection('storage').where("category", "==", query).get() }
    else { collection = await db.collection('storage').get() }
    collection.docs.map(doc => { console.log(doc.id, " => ", doc.data()) })
    const listProduct = collection.docs.map(
        (val) => {
            const objOut = val.data()
            objOut._id = val.id
            listOut.push(objOut)
        }
    )
    await Promise.all(listProduct)
    return listOut
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

export default {
    findAll,
    findOne
}

