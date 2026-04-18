 // Core Modules
const path = require('path');

// External Module
const express = require('express');
const storeRouter = express.Router();

// Local Module

const storecontroler=require('../controllers/StoreController');
storeRouter.get("/",storecontroler.getIndex);
storeRouter.get("/homes",storecontroler.registeredhome);               
storeRouter.get("/homes/:homeid",storecontroler.getHomeDetails);
storeRouter.get("/search", storecontroler.searchHomes);
storeRouter.get("/favourite", storecontroler.getFavouriteList);

storeRouter.post("/favourite", storecontroler.addToFavourite);
storeRouter.get("/ml-recommend/:id", storecontroler.getRecommendations);
storeRouter.post(
  "/favourite/delete/:homeid",
  storecontroler.removeFavourite
);



module.exports = storeRouter;