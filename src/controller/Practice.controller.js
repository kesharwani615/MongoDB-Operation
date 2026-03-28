import mongoose from "mongoose";
import Order from "../model/order.model.js";
import Product from "../model/product.model.js";
import User from "../model/user.model.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import Review from "../model/review.model.js";

export const user = asyncHandler(async (req, res) => {
    try {
        const {city} = req.query;

        const filter = {};
        const project = {
            name: 1,
            email: 1
        };

        console.log("city:", city);

        if (city) {
            filter.city = {
                $regex: city,
                $options: "i"
            };
        }

        const users = await User.aggregate([
            {
                $match: filter
            }, {
                $project: project
            },
        ]);

        res.status(200).json({success: true, message: "User data retrieved successfully", data: users});
    } catch (error) {
        console.log(error);
    }
});

export const getDeliveredOrders = asyncHandler(async (req, res) => {
    try {
        const {status} = req.query;

        let filter = {};
        if (status) {
            filter.status = {
                $regex: status,
                $options: "i"
            };
        }

        const deliveredOrders = await Order.aggregate([{
                $match: filter, // filter only Delivered orders
            },]);

        if (! deliveredOrders.length) {
            return res.status(404).json({success: false, message: "No delivered orders found", data: []});
        }

        res.status(200).json({success: true, message: "Delivered orders retrieved successfully", count: deliveredOrders.length, data: deliveredOrders});
    } catch (error) {
        console.error("Error fetching delivered orders:", error);
        res.status(500).json({success: false, message: "Server error while retrieving delivered orders", error: error.message});
    }
});

export const productCountByCategory = asyncHandler(async (req, res) => {
    try {
        const productCount = await Product.aggregate([
            // { $match: { category: "Electronics" } },
            {
                $sort: {
                    price: 1
                }
            }, {
                $group: {
                    _id: "$category",
                    count: {
                        $sum: 1
                    },
                    products: {
                        $push: "$$ROOT"
                    },
                    minPrice: {
                        $min: "$price"
                    }
                }
            }, 
            {
                $set: {
                    products: {
                        $sortArray: {
                            input: "$products",
                            sortBy: {
                                price: -1
                            }
                        }
                    }
                }
            },
             {
                $project: {
                    minPrice: 0
                }
            }

        ]);

        res.status(200).json({success: true, message: "Product count by category retrieved successfully", data: productCount});
    } catch (error) {}
});

export const totalOrderByUser = asyncHandler(async (req, res) => {
    try {

        const {userId} = req.params;

        if (!userId) 
            return res.status(401).json("User id is not provided");
        

        const user = await User.findOne({_id: userId});

        if (! user) 
            return res.status(401).json({success: false, message: "User does not exist!"});
        

        const userMongoObjectId = new mongoose.Types.ObjectId(userId);

        const result = await Order.aggregate([
            {
                $match: {
                    userId: userMongoObjectId
                } // 👈 filter one user
            },
            {
                $group: {
                    _id: "$userId",
                    totalOrder: {
                        $sum: 1
                    }
                }
            },
            {
                $lookup: {
                    from: "users", // collection to join
                    localField: "_id", // userId from group (_id)
                    foreignField: "_id", // _id in users collection
                    as: "userDetails"
                }
            },
            {
                $unwind: "$userDetails" // convert array to single object
            },
             {
                $project: {
                    _id: 0,
                    totalOrder: 1,
                    "userDetails._id": 1,
                    "userDetails.name": 1,
                    "userDetails.email": 1,
                    "userDetails.city": 1,
                    "userDetails.age": 1
                }
            }
        ]);

        res.status(200).json({success: true, data: result})

    } catch (error) {
        console.log("error::", error);
        res.status(500).json({success: false, message: error})
    }
})

export const totalSpendAmountByUser = asyncHandler(async (req, res) => {
    try {
        const {userId} = req.params;

        if (!userId) {
            return res.status(400).json({success: false, message: "User ID is required"});
        }

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({success: false, message: "Invalid user ID format"});
        }

        const userMongoObjectId = new mongoose.Types.ObjectId(userId);

        const result = await Order.aggregate([
            {
                $match: {
                    userId: userMongoObjectId
                }
            },
            {
                $group: {
                    _id: "$userId",
                    totalSpentAmount: {
                        $sum: "$totalAmount"
                    },
                    totalOrders: {
                        $sum: 1
                    }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $unwind: {
                    path: "$userDetails",
                    preserveNullAndEmptyArrays: true, // prevent crash if no user found
                }
            }, {
                $project: {
                    _id: 0,
                    totalSpentAmount: 1,
                    totalOrders: 1,
                    "userDetails._id": 1,
                    "userDetails.name": 1,
                    "userDetails.email": 1,
                    "userDetails.age": 1,
                    "userDetails.city": 1
                }
            },
        ]);

        if (! result.length) {
            return res.status(404).json({success: false, message: "No orders found for this user"});
        }

        return res.status(200).json({success: true, data: result[0]});
    } catch (error) {
        console.error("Error in totalSpendAmountByUser:", error);
        return res.status(500).json({success: false, message: "Internal Server Error", error: error.message});
    }
});

export const topMostExpensiveProduct = asyncHandler(async (req, res) => {
    const {
        limit = 5,
        page = 1
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const result = await Product.aggregate([
        {
            $sort: {
                price: -1
            }
        }, {
            $skip: skip
        }, {
            $limit: Number(limit)
        }
    ])

    res.status(200).json({success: true, data: result});
})

export const totalAvailableStock = asyncHandler(async (req, res) => {

    const result = await Product.aggregate([{
            $group: {
                _id: "$category",
                totalStock: {
                    $sum: "$stock"
                }
            }
        }])

    res.status(200).json({success: true, data: result});

})

export const getAllUniqueTag = asyncHandler(async (req, res) => {
    const result = await Product.aggregate([
        {
            $unwind: "$tags"
        }, {
            $group: {
                _id: null,
                allTags: {
                    $addToSet: "$tags"
                }
            }
        }
    ])

    res.status(200).json({success: true, data: result});
})

export const orderWithUser = asyncHandler(async (req, res) => {
    const result = await Order.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userDetails"
            }
        }, {
            $unwind: "$userDetails"
        }, {
            $project: {
                _id: 1,
                totalAmount: 1,
                status: 1,
                items: 1,
                "userDetails.name": 1,
                "userDetails.email": 1
            }
        }

    ])

    res.status(200).json({success: true, data: result});
})

export const orderDetailsWithProduct = asyncHandler(async (req, res) => {
    const result = await Order.aggregate([
        {
            $unwind: "$items"
        }, {
            $lookup: {
              from:"products",
              localField:"items.productId",
              foreignField:"_id",
              as:"productDetails"
            }
        },
        {
          $unwind:"$productDetails"
        },
       {
        $project : {
          _id:1,
          totalAmount:1,
          orderDate:1,
          status:1,
          "productDetails.name":1,
          "productDetails.category":1,
          "productDetails.price":1,
          "productDetails.stock":1,
        }
      }
    ])

    res.status(200).json({success: true, data: result});
})

export const showReviewAlongWithProduct = asyncHandler(async(req,res)=>{
  const result = await Review.aggregate([
    {
      $lookup:{
        from:"products",
        localField:"productId",
        foreignField:"_id",
        as:"ProductDetails",
      }  
    },
    
    {
      $lookup:{
        from:"users",
        localField:"userId",
        foreignField:"_id",
        as:"userDatails",
      }
    },
    
  ])

  res.status(200).json({success:true,data:result});
})

export const  GetUserNeverPlacedOrder = asyncHandler(async(req,res)=>{
  
    const result = await User.aggregate([
      {
        $lookup:{
          from:"orders",
          localField:"_id",
          foreignField:"userId",
          as:"orderData"
        }
      },
      {
        $match:{
          "orderData":{$size:0}
        }
      }
    ])

    res.status(200).json({success:true,data:result});
})

export const ProductListNeverOrder = asyncHandler(async(req,res)=>{
  const result = await Product.aggregate([
    {
      $lookup:{
        from:"orders",
        localField:"_id",
        foreignField:"items.productId",
        as:"orderData"
      }
    },
    {
      $match:{
        "orderData":{$size:0}
      }
    }
  ])

  res.status(200).json({success:true,data:result});
})

export const OrderDetailsWithUserAndProduct = asyncHandler(async(req,res)=>{

    const project ={
        _id:1,
        "userId":1,
        "totalAmount":1,
        "orderDate":1,
        "status":1,
        "userDetails._id":1,
        "userDetails.name":1,
        "userDetails.email":1,
        "userDetails.age":1,
        "userDetails.city":1,
        "userDetails.joinDate":1,
        "productDetails._id":1,
        "productDetails.name":1,
        "productDetails.category":1,
        "productDetails.price":1,
        "productDetails.stock":1,
        "productDetails.tags":1
    }

    const result = await Order.aggregate([
        {
            $lookup:{
                from:"users",
                localField:"userId",
                foreignField:"_id",
                as:"userDetails"
            },
        },
        {
            $lookup:{
                from:"products",
                localField:"items.productId",
                foreignField:"_id",
                as:"productDetails"
            }
        },
        {
            $unwind:"$userDetails"
        },
        {
            $project:project
        }
    ])

    res.status(200).json({success:true,data:result});
})

export const OrderDetailsWithProduct = asyncHandler(async(req,res)=>{
    const result = await Order.aggregate([
        {
            $lookup:{
                from:"products",
                localField:"items.productId",
                foreignField:"_id",
                as:"productDetails"
            }
        },
        {
            $unwind:"$productDetails"
        }
    ])

    res.status(200).json({success:true,data:result});
})

export const reviewDetailsWithUserAndProduct = asyncHandler(async(req,res)=>{
    const result = await Review.aggregate([
        {
            $lookup:{
                from:"users",
                localField:"userId",
                foreignField:"_id",
                as:"userDetails"
            }
        },
        {
            $lookup:{
                from:"products",
                localField:"productId",
                foreignField:"_id",
                as:"productDetails"
            }
        },
        {
            $unwind:"$userDetails"
        },
        {
            $unwind:"$productDetails"
        }
    ])

    res.status(200).json({success:true,data:result});
})

export const UserneverPlaceOrder = asyncHandler(async(req,res)=>{
    const result = await User.aggregate([
        {
            $lookup:{
                from:"orders",
                localField:"_id",
                foreignField:"userId",
                as:"orderData"
            }
        },
        {
            $match:{
                $expr:{
                    $gt:[{$size:"$orderData"},0]
                }
            }
        }
    ])

    res.status(200).json({success:true,data:result});
})

export const totalRevenueAllOrders = asyncHandler(async (req, res) => {
    const result = await Order.aggregate([
        {
            $group:{
                _id:null,
                totalRevenue:{$sum:"$totalAmount"}
            }
    }
    ])
    res.status(200).json({success: true, data: result});
})

export const totalQuantitySoldByProduct = asyncHandler(async (req, res) => {
    const result = await Order.aggregate([
        {
            $unwind: "$items"
        },
        {
            $group:{
                _id:"$items.productId",
                totalQuantitySold:{$sum:"$items.quantity"}
            }
        },
        {
            $lookup:{
                from:"products",
                localField:"_id",
                foreignField:"_id",
                as:"productDetails"
            }
        }
        

    ])

    res.status(200).json({success: true, data: result});
})

export const totalAvarageAmountByUser = asyncHandler(async (req, res) => {
    const result = await Order.aggregate([
        {
            $group:{
                _id:"$userId",
                totalAmountSpent:{$sum:"$totalAmount"}
            }
        },
        {
          $lookup:{
            from:"users",
            localField:"_id",
            foreignField:"_id",
            as:"userDetails"
          }
        }
    ])

    res.status(200).json({success: true, data: result});
})

export const topCityByNumberOfUser = asyncHandler(async (req, res) => {
    const result = await User.aggregate([
        {
            $group:{
                _id:"$city",
                userCount:{$sum:1}
            }
        },
        {
            $sort:{
                userCount:-1
            }
        },
        {
            $limit:5
        }
    ])

    res.status(200).json({success: true, data: result});
})

export const MonthWithHighestOrders = asyncHandler(async (req, res) => {
    // const result = await Order.aggregate([
    //     {
    //         $group:{
    //             _id:{ $month: "$orderDate" },
    //             totalOrders:{$sum:1}
    //         },
            
    //     },
    //     {
    //         $set:{
    //             month:{
    //                 $arrayElemAt:[
    //                 ['','January','February','March','April','May','June','July','August','September','October','November','December'],
    //                 '$_id'
    //             ]
    //             }
    //         }
    //     }
    // ]) 

  const result = await  Order.aggregate([
  {
    $project: {
      month: {
        $dateToString: { format: "%B", date: "$orderDate" } // Get month name
      },
      amount: "$totalAmount" // Your sale field (change if needed)
    }
  },
  {
    $group: {
      _id: "$month",
      totalSales: { $sum: "$amount" }
    }
  },
  {
    $sort: { totalSales: -1 } // Highest sales at top
  },
//   {
//     $limit: 1 // Only return the top month
//   }
])


    res.status(200).json({success: true, data: result});
})

export const FlattenOrderProduct = asyncHandler(async (req, res) => {
    const result = await Order.aggregate([
        {
            $unwind: "$items"
        },
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
        }
    ]);

    res.status(200).json({success: true, data: result});
})

