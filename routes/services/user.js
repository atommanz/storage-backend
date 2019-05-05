
import User from '../../models/users'


const getUser = async (username) => {
    const promiseUser = await User.find({
        username
    })
    return promiseUser
}


export default {
    getUser,
}

