import { Router } from "express";
import { allReviewsWithProduct, avarageOrderAmountByUser, avgRatingForEachProduct, avgReviewRating, EachProductShowRevenueAndAvgRating, findOrderMorethan2Items, findTopHighestRatedProduct, findWhoGaveRatingLessThan3, findWhoNeverPlaceOrder, flattenItemsInOrder, flattenOrders, getAllListOfUniqueTags, getListOfTags, getSortedProducts, getUserMatchCount, getUserProject, getUsers, joinOrderWithUser, maxQuantityBoughtProduct, monthWithHighestRevenue, OrderWithProductForEachUser, productNeverOrdered, showFirstProductInEachOrder, showOnlyFirstProductIneachOrder1, topCityByNumberOfUser, topMostExpensiveProduct, totalOrderByUser, totalQuantitySold, totalRevenueGenerated, totalSpendAmountByUser, totalSpendOnEachTag, totalStockAvailable } from "../controller/Mongo.controller.js";
import { JoinOrderWithUserAndProduct, totalGeneratedRevenue, whoNeverPlaceOrder } from "../controller/Practice.controller.js";

const router = Router();

router.get('/getUsers', getUsers);

router.get('/getUserProject', getUserProject);

router.get('/getUserMatchCount', getUserMatchCount);

router.get('/getSortedProducts', getSortedProducts);

router.get('/totalOrderByUser', totalOrderByUser);

router.get('/totalSpendAmountByUser', totalSpendAmountByUser);

router.get('/topMostExpensiveProduct', topMostExpensiveProduct);

router.get('/totalStockAvailable', totalStockAvailable);

router.get('/getListOfTags', getListOfTags);

router.get('/totalRevenueGenerated', totalRevenueGenerated);

router.get('/totalQuantitySold', totalQuantitySold);

router.get('/avarageOrderAmountByUser', avarageOrderAmountByUser);

router.get('/topCityByNumberOfUser', topCityByNumberOfUser);

router.get('/monthWithHighestRevenue', monthWithHighestRevenue);

router.get('/flattenItemsInOrder', flattenItemsInOrder);

router.get('/showFirstProductInEachOrder', showFirstProductInEachOrder);

router.get('/totalSpendOnEachTag', totalSpendOnEachTag);

router.get('/findOrderMorethan2Items', findOrderMorethan2Items);

router.get('/maxQuantityBoughtProduct', maxQuantityBoughtProduct);

router.get('/joinOrderWithUser', joinOrderWithUser);

router.get('/OrderWithProductForEachUser', OrderWithProductForEachUser);

router.get('/allReviewsWithProduct', allReviewsWithProduct);

router.get('/findWhoNeverPlaceOrder', findWhoNeverPlaceOrder);

router.get('/productNeverOrdered', productNeverOrdered);

router.get('/avgRatingForEachProduct', avgRatingForEachProduct);

router.get('/findTopHighestRatedProduct', findTopHighestRatedProduct);

router.get('/findWhoGaveRatingLessThan3', findWhoGaveRatingLessThan3);

router.get('/EachProductShowRevenueAndAvgRating', EachProductShowRevenueAndAvgRating);

router.get('/JoinOrderWithUserAndProduct', JoinOrderWithUserAndProduct);

router.get('/totalGeneratedRevenue', totalGeneratedRevenue);

router.get('/whoNeverPlaceOrder', whoNeverPlaceOrder);

router.get('/avgReviewRating', avgReviewRating);

router.get('/flattenOrders', flattenOrders);

router.get('/showOnlyFirstProductIneachOrder1', showOnlyFirstProductIneachOrder1);

router.get('/getAllListOfUniqueTags', getAllListOfUniqueTags);

export default router;