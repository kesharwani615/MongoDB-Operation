import { FlattenOrderProduct, getAllUniqueTag, getDeliveredOrders, GetUserNeverPlacedOrder, JoinOrderWithUserAndProduct, MonthWithHighestOrders, OrderDetailsWithProduct, orderDetailsWithProduct, OrderDetailsWithUserAndProduct, orderWithUser, productCountByCategory, ProductListNeverOrder, reviewDetailsWithUserAndProduct, showReviewAlongWithProduct, topCityByNumberOfUser, topMostExpensiveProduct, totalAvailableStock, totalAvarageAmountByUser, totalOrderByUser, totalQuantitySoldByProduct, totalRevenueAllOrders, totalSpendAmountByUser, user, UserneverPlaceOrder } from "../controller/Practice.controller.js";
import { Router } from "express";

const router = Router();

router.get("/", user);

router.get("/order", getDeliveredOrders);

router.get("/productCountByCategory", productCountByCategory);

router.get("/totalOrderByUser/:userId", totalOrderByUser);

router.get("/totalSpendAmountByUser/:userId", totalSpendAmountByUser);

router.get("/topMostExpensiveProduct", topMostExpensiveProduct);

router.get("/totalAvailableStock", totalAvailableStock);

router.get("/getAllUniqueTag", getAllUniqueTag);

router.get("/orderWithUser", orderWithUser);

router.get("/orderDetailsWithProduct", orderDetailsWithProduct);

router.get("/showReviewAlongWithProduct", showReviewAlongWithProduct);

router.get("/GetUserNeverPlacedOrder", GetUserNeverPlacedOrder);

router.get("/ProductListNeverOrder", ProductListNeverOrder);

router.get("/OrderDetailsWithUserAndProduct", OrderDetailsWithUserAndProduct);

router.get("/OrderDetailsWithProduct", OrderDetailsWithProduct);

router.get("/reviewDetailsWithUserAndProduct", reviewDetailsWithUserAndProduct);

router.get("/UserneverPlaceOrder", UserneverPlaceOrder);

router.get("/totalRevenueAllOrders", totalRevenueAllOrders);

router.get("/totalQuantitySoldByProduct", totalQuantitySoldByProduct);

router.get("/totalAvarageAmountByUser", totalAvarageAmountByUser);

router.get("/topCityByNumberOfUser", topCityByNumberOfUser);

router.get("/MonthWithHighestOrders", MonthWithHighestOrders);

router.get("/FlattenOrderProduct", FlattenOrderProduct);

router.get("/JoinOrderWithUserAndProduct", JoinOrderWithUserAndProduct);

export default router;