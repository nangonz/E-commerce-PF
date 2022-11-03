const { Offer } = require('../db.js');

const getOffers = async (req, res)=>{
    try {
        const offers = await Offer.findAll({
            order: [["id", "ASC"]]
        });
        res.json(offers);
    } catch (error) {
        res.json(error.message);
    }
}

const getOfferById = async (req, res)=>{
    const id = req.params;
    try {
        const offer = await Offer.findOne({
            where:{
                id
            }
        });
        res.json(offer);
    } catch (error) {
        res.json(error.message);
    }
}

const postOffers = async (req, res)=>{
    const { products, offer } = req.body
    try {
        const [createdOffer, created] = await Offer.findOrCreate({
            where:{
                ...offer
            }
        });
        await createdOffer.setProducts(products);
        res.json("Offer successfully published");
    } catch (error) {
        res.json(error.message);
    }
}

const deleteOffers = async (req, res)=>{
    try {
        await Offer.destroy({
            truncate:{ cascade: true},
        });
        res.json("All offers successfully eliminated")
    } catch (error) {
        res.json(error.message);
    }
}

const deleteOfferById = async (req, res)=>{
    const id = req.params;
    try {
        await Offer.destroy({
            where:{
                ProductId: id
            },
            truncate:{ cascade: true}
        });
        res.json("Delete successfully");
    } catch (error) {
        res.json(error.message);
    }
}

const updateOfferById = async (req, res)=>{
    const id = req.params;
    const offer = req.body;
    try {
        await Offer.update( offer, { where:{ id } });
        res.json("Update successfully");
    } catch (error) {
        res.json(error.message);
    }
}

module.exports = {
    getOffers,
    getOfferById,
    postOffers,
    deleteOffers,
    deleteOfferById,
    updateOfferById 
}