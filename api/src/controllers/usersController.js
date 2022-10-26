const { Op } = require('sequelize');
const { User } = require('../db.js');
const emailNotifications = require('../utils/emailNotifications.js');
const message = require('../utils/emailMessages');
const { uploadImage } = require('../utils/cloudinary.js');
const fs = require('fs-extra');


const getUsers = async (req, res) => {

    const { page, size, search } = req.query;
    const offset = page || 0;
    const limit  = size || 12;
    let where    = {};

    if(search) where.email = {[Op.iLike]: `%${search}%`};

    try {

        const users = await User.findAndCountAll({
            where,
            limit,
            offset
        })

        return res.json({
            totalPages: Math.ceil(users.count / limit), 
            products: users.rows
        });
            
    } catch (error) {
        res.status(400).json("Not Found Users");
        
    }
}

const postUser = async (req, res)=>{
    try {
        const user = req.body;
        await User.create(user);
        emailNotifications(user.email,"Registration on Tecnoshop 💌",message.registration);
        res.json("New User created");
    } catch (error) {
        res.status(400).json(error.message);
    }
}

const getUserCheck = async (req, res)=>{
    try {
        const {email} = req.params;

        const user = await User.findOne({
            where:{
                email
            }
        });

        if(!user) return res.json({block: null});
        return res.json({block: user.block})
        
    } catch (error) {
        res.json(error.message);
    }
}

const blockUser = async (req, res)=>{
    const { email, block } = req.params

    try {
        const user = await User.update({block},{
            where: {
                email
            }
        })
        if(user[0]) return res.json( block==="true" ? "block" : "unblock" );
        return res.json("Not match user");
    } catch (error) {
        res.json(error.message)
    }
}

const updateUser = async (req, res)=>{
    const { email } = req.params;
    const { image, ...updateData } = req.body;
    try {
        if(image) {
            let imageUploaded = await uploadImage(image)
            updateData.image  = imageUploaded.secure_url;
        }
        //await fs.unlink(`./src/uploads/${image}`);
        User.update(updateData,{
            where: {
                email
            }
        })
        .then( (data) => res.status(200).json("Updated successfully") )
        .catch( (error) => res.status(400).json({error: error.message}) )
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

const getUserByEmail = async ( req, res)=>{

    const email = req.params.email;
    try {
        const user = await User.findOne({
            where:{
                email: email
            }
        })
        return res.json(user);
    } catch (error) {
        res.json(error.message);
    }

}

module.exports = {
    getUsers,
    postUser,
    getUserCheck,
    blockUser,
    updateUser,
    getUserByEmail
}