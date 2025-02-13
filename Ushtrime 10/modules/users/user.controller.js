import User from "./user.model.js"


export const createUser = async (req, res) => {
    try {
        const firstName = req.body.firstName
        const lastName = req.body.lastName
        const email = req.body.email
        const password = req.body.password
        const phoneNumber = req.body.phoneNumber
        const role = req.body.role

        const user = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            phoneNumber: phoneNumber,
            role: role
        })
       await user.save()
       res.status(201).json(user)
    } catch (error) {
        console.log(error, "erroridsf")
        res.status(400).json({message: error})
    }
}