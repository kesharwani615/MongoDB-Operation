import Order from "../model/order.model.js";
import Product from "../model/product.model.js";
import User from "../model/user.model.js";
import Review from "../model/review.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import redis from "../config/redis.js";

export const getUsers = asyncHandler(async (req, res) => {
    try {

        const cache = await redis.get("userData");

        if (cache) {
            console.log("⚡ from cache");
            return res.json(JSON.parse(cache));
        }

        const user = await User.aggregate([
            {
                $match: {
                    city: { $regex: "", $options: "i" }
                }
            }
        ])

        await redis.set("userData", JSON.stringify(user), "EX", 60);

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
})

export const getUserProject = asyncHandler(async (req, res) => {
    try {
        const user = await User.aggregate([
            {
                $project: {
                    name: 1,
                    email: 1,
                    _id: 0
                }
            }
        ])
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
})

export const getUserMatchCount = asyncHandler(async (req, res) => {
    try {
        const user = await Product.aggregate([
            {
                $match: {
                    category: { $regex: "electronics", $options: "i" }
                }
            },
            {
                $count: "totalProducts"
            }
        ])

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
})

export const getSortedProducts = asyncHandler(async (req, res) => {
    try {
        const user = await Product.aggregate([
            {
                $sort: {
                    price: -1
                }
            }
        ])
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
})

export const totalOrderByUser = asyncHandler(async (req, res) => {
    try {
        const user = await Order.aggregate([
            {
                $group: {
                    _id: "$userId",
                    orders: { $push: "$$ROOT" }
                }
            }
        ])
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
})

export const totalSpendAmountByUser = asyncHandler(async (req, res) => {
    try {
        const user = await Order.aggregate([
            {
                $group: {
                    _id: "$userId",
                    totalSpentAmount: { $sum: "$totalAmount" }
                }
            }
        ])

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
})

export const topMostExpensiveProduct = asyncHandler(async (req, res) => {
    try {
        const user = await Product.aggregate([
            {
                $sort: {
                    price: -1
                }
            },
            {
                $limit: 2
            }
        ])
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
})

export const totalStockAvailable = asyncHandler(async (req, res) => {
    try {
        const user = await Product.aggregate([
            {
                $group: {
                    _id: "$category",
                    totalStock: { $sum: "$stock" }
                }
            }
        ])

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
})

export const getListOfTags = asyncHandler(async (req, res) => {
    try {
        const tags = await Product.aggregate([
            {
                $unwind: "$tags"
            },
            {
                $group: {
                    _id: null,
                    uniqueTags: { $addToSet: "$tags" }
                }
            }
        ])

        res.status(200).json({ success: true, data: tags });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
})

export const totalRevenueGenerated = asyncHandler(async (req, res) => {
    try {
        const revenue = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalAmount" }
                }
            }
        ])

        res.status(200).json({ success: true, data: revenue });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
})

export const totalQuantitySold = asyncHandler(async (req, res) => {
    try {

        const quantity = await Order.aggregate([
            {
                $unwind: "$items"
            },
            {
                $group: {
                    _id: "$items.productId",
                    totalQuantitySold: { $sum: "$items.quantity" }
                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            {
                $unwind: "$productDetails"
            }
        ])

        res.status(200).json({ success: true, data: quantity });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
})

export const avarageOrderAmountByUser = asyncHandler(async (req, res) => {
    try {
        const avarage = await Order.aggregate([
            {
                $group: {
                    _id: "$userId",
                    averageOrderAmount: { $avg: "$totalAmount" }
                }
            },
            {
                $project: {
                    _id: 0,
                    userId: "$_id",
                    averageOrderAmount: 1,
                }
            }
        ])

        res.status(200).json({ success: true, data: avarage });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
})

export const topCityByNumberOfUser = asyncHandler(async (req, res) => {
    try {
        const city = await User.aggregate([
            {
                $group: {
                    _id: "$city",
                    userCount: { $sum: 1 }
                }
            }
        ])

        res.status(200).json({ success: true, data: city });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
})

export const monthWithHighestRevenue = asyncHandler(async (req, res) => {
    try {
        const revenue = await Order.aggregate([
            {
                $project: {
                    month: {
                        $dateToString: {
                            format: "%B",
                            date: "$orderDate"
                        }
                    },
                    amount: "$totalAmount"
                }
            },
            {
                $group: {
                    _id: "$month",
                    totalRevenue: { $sum: "$amount" }
                }
            },
            {
                $project: {
                    _id: 0,
                    month: "$_id",
                    totalRevenue: 1,
                }
            },
            {
                $sort: {
                    totalRevenue: -1
                }
            }
        ])

        res.status(200).json({ success: true, data: revenue });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
})

export const flattenItemsInOrder = asyncHandler(async (req, res) => {
    try {
        const items = await Order.aggregate([
            {
                $unwind: "$items"
            }
        ])

        res.status(200).json({ success: true, data: items });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
})

export const showFirstProductInEachOrder = asyncHandler(async (req, res) => {
    try {
        const product = await Order.aggregate([
            {
                $project: {
                    _id: 0,
                    totalAmount: 1,
                    orderDate: 1,
                    status: 1,
                    items: { $arrayElemAt: ["$items", 0] }
                }
            }
        ])

        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
})

export const totalSpendOnEachTag = asyncHandler(async (req, res) => {
    try {
        const spend = await Product.aggregate([
            {
                $unwind: "$tags"
            },
            {
                $group: {
                    _id: "$tags",
                    totalSpend: { $sum: "$price" }
                }
            },
            {
                $project: {
                    _id: 0,
                    tag: "$_id",
                    totalSpend: 1,
                }
            }
        ])

        res.status(200).json({ success: true, data: spend });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
})

export const findOrderMorethan2Items = asyncHandler(async (req, res) => {
    try {
        const order = await Order.aggregate([
            {
                $project: {
                    _id: 0,
                    totalAmount: 1,
                    orderDate: 1,
                    status: 1,
                    items: { $size: "$items" }
                }
            },
            {
                $match: {
                    items: { $gte: 2 }
                }
            }
        ])

        res.status(200).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
})

export const maxQuantityBoughtProduct = asyncHandler(async (req, res) => {
    try {
        const maxQuantity = await Order.aggregate([
            {
                $unwind: "$items"
            },
            {
                $group: {
                    _id: "$items.productId",
                    totalQuantity: { $sum: "$items.quantity" }
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            {
                $project: {
                    _id: 0,
                    productId: "$_id",
                    totalQuantity: 1,
                    productDetails: { $arrayElemAt: ["$productDetails", 0] }
                }
            }
        ])

        res.status(200).json({ success: true, data: maxQuantity });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
})

export const joinOrderWithUser = asyncHandler(async (req, res) => {
    try {
        const OrderWithUser = await Order.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails"
                }
            }
        ])

        res.status(200).json({ success: true, data: OrderWithUser });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
})

export const OrderWithProductForEachUser = asyncHandler(async (req, res) => {
    try {
        const OrderWithProduct = await Order.aggregate([
            {
                $lookup: {
                    from: "products",
                    localField: "items.productId",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            {
                $unwind: "$productDetails"
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $unwind: "$userDetails"
            }
        ])

        res.status(200).json({ success: true, data: OrderWithProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
})

export const allReviewsWithProduct = asyncHandler(async (req, res) => {
    try {
        const reviews = await Review.aggregate([
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            {
                $unwind: "$productDetails"
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $unwind: "$userDetails"
            }
        ])

        res.status(200).json({ success: true, data: reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
})

export const findWhoNeverPlaceOrder = asyncHandler(async (req, res) => {
    try {
        const user = await User.aggregate([
            {
                $lookup: {
                    from: "orders",
                    localField: "_id",
                    foreignField: "userId",
                    as: "orderData"
                }
            },
            {
                $match: {

                }
            }
        ])

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
})

export const productNeverOrdered = asyncHandler(async (req, res) => {
    try {
        const product = await Product.aggregate([
            {
                $lookup: {
                    from: "orders",
                    localField: "_id",
                    foreignField: "items.productId",
                    as: "orderData"
                }
            },
            {
                $match: {
                    $expr: {
                        $eq: [{ $size: "$orderData" }, 0]
                    }
                }
            }
        ])

        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
})

export const avgRatingForEachProduct = asyncHandler(async (req, res) => {
    try {
        const avgRating = await Product.aggregate([
            {
                $lookup: {
                    from: "reviews",
                    localField: "_id",
                    foreignField: "productId",
                    as: "reviewData"
                }
            },
            {
                $unwind: "$reviewData"
            },
            {
                $group: {
                    _id: "$_id",
                    product: { $addToSet: { "name": "$name", "price": "$price" } },
                    avgRating: { $avg: "$reviewData.rating" }
                }
            },
            {
                $unwind: "$product"
            }

        ])

        res.status(200).json({ success: true, data: avgRating });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
})

export const findTopHighestRatedProduct = asyncHandler(async (req, res) => {
    try {
        const topRatedProduct = await Product.aggregate([
            {
                $group: {
                    _id: "$_id",
                    product: { $addToSet: { "name": "$name", "price": "$price" } },
                }
            },
            {
                $unwind: "$product"
            },
            {
                $sort: {
                    "product.price": -1
                }
            },
            {
                $limit: 2
            }
        ])

        res.status(200).json({ success: true, data: topRatedProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
})

export const findWhoGaveRatingLessThan3 = asyncHandler(async (req, res) => {
    try {
        const rating = await User.aggregate([
            {
                $lookup: {
                    from: "reviews",
                    localField: "_id",
                    foreignField: "userId",
                    as: "reviewData"
                }
            },
            {
                $unwind: "$reviewData"
            },
            {
                $match: {
                    $expr: {
                        $lte: ["$reviewData.rating", 3]
                    }
                }
            }
        ])

        res.status(200).json({ success: true, data: rating });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
})

export const EachProductShowRevenueAndAvgRating = asyncHandler(async (req, res) => {
    try {
        const showRevenue = await Product.aggregate([
            {
                $lookup: {
                    from: "orders",
                    localField: "_id",
                    foreignField: "items.productId",
                    as: "orders"
                }
            },
            {
                $unwind: {
                    path: "$orders",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: "$orders.items",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {
                    $expr: {
                        $eq: ["$orders.items.productId", "$_id"]
                    }
                }
            },
            {
                $lookup: {
                    from: "reviews",
                    localField: "_id",
                    foreignField: "productId",
                    as: "reviews"
                }
            },
            {
                $unwind: "$reviews"
            },
            {
                $group: {
                    _id: "$_id",
                    productName: { $first: "$name" },
                    totalRevenue: { $sum: "$orders.totalAmount" },
                    avgRating: { $avg: "$reviews.rating" }
                }
            },
            {
                $project: {
                    _id: 0,
                    productId: "$_id",
                    productName: 1,
                    totalRevenue: 1,
                    avgRating: 1
                }
            }
        ])

        res.status(200).json({ success: true, data: showRevenue });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
})

export const avgReviewRating = asyncHandler(async (req, res) => {
    try {
        const result = await Review.aggregate([
            {
                $group: {
                    _id: "$productId",
                    avgRating: { $avg: "$rating" }
                }
            },
            {
                $lookup: {
                    from: "product",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            {
                $unwind: "$productDetails"
            }
        ])

        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
})
export const flattenOrders = asyncHandler(async (req, res) => {
    try {
        const result = await Order.aggregate([
            {
                $unwind: "$items"
            },
            {
                $lookup: {
                    from: "product",
                    localField: "items.productId",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            {
                $unwind: "$productDetails"
            }
        ])

        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
})

export const showOnlyFirstProductIneachOrder1 = asyncHandler(async (req, res) => {
    try {
        const result = await Order.aggregate([
            {
                $lookup: {
                    from: "product",
                    localField: "items.productId",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            {
                $project: {
                    _id: 0,
                    totalAmount: 1,
                    orderDate: 1,
                    status: 1,
                    productDetails: {
                        $arrayElemAt: ["$productDetails", 0]
                    }
                }
            }
        ])

        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
})

export const findOrderWhichMoreThan1Item = asyncHandler(async (req, res) => {
    try {
        const result = await Order.aggregate([
            {
                $match: {
                    $expr: {
                        $gt: ["$items.quantity", 1]
                    }
                }
            },
            {
                $lookup: {
                    from: "product",
                    localField: "items.productId",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            {
                $unwind: "$productDetails"
            }
        ])

        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
})

export const getAllListOfUniqueTags = asyncHandler(async (req, res) => {
    try {
        const result = await Product.aggregate([
            {
                $unwind: "$tags"
            }
        ])
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
})

export const secondLargest = asyncHandler(async (req, res) => {
    try {
        const result = await Product.aggregate([
            {
                $sort: {
                    price: -1
                }
            },
            {
                $skip: 1
            },
            {
                $limit: 1
            }
        ])
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
})