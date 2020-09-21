const express = require("express");
const router = express.Router();
const db = require("../models");
const bcrypt = require("bcryptjs");


// index
router.get("/", (req, res) => {
    db.Order.find({}, (error, foundOrders) => {
      if (error) return res.send(error);
  
      const context = {
        orders: foundOrders,
      };
  
      res.render("orders/index", context);
    });
  });
  
  // new
  router.get("/new", (req, res) => {
    db.User.find({}, (err, foundUsers) => {
      if (err) return res.send(err);
  
      const context = {
        user: foundUsers,
      };
  
      res.render("orders/new", context);
    });
  });
  
  // create
  router.post("/", async (req, res) => {
    console.log(req.body);
    // db.Order.create(req.body, function (err, createdOrder) {
    //   if (err) {
    //     console.log(err);
    //     return res.send(err);
    //   }
    //   db.User.findById(req.body.user, function (err, foundUser) {
    //     if (err) {
    //       console.log(err);
    //       return res.send(err);
    //     }
  
    //     foundUser.orders.push(createdOrder);
    //     foundUser.save(); // important because this commits the user back to the db
  
    //     res.redirect("/orders");
    //   });
    // });
  
    try {
      const createdOrder = await db.Order.create(req.body);
      const foundUser = await db.User.findById(req.body.user);
  
      foundUser.orders.push(createdOrder);
      await foundUser.save();
  
      res.redirect("/orders");
    } catch (error) {
      console.log(error);
      res.send({ message: "Internal server error" });
    }
  });
  
  // show
  router.get("/:id", function (req, res) {
    db.Order.findById(req.params.id, function (err, foundOrder) {
      if (err) {
        console.log(err);
        return res.send(err);
      }
      const context = { orders: foundOrder };
      res.render("orders/show", context);
    });
  });
  
  // edit
  router.get("/:id/edit", function (req, res) {
    db.Order.findById(req.params.id, function (err, foundOrder) {
      if (err) {
        console.log(err);
        return res.send(err);
      }
      const context = { orders: foundOrder };
      res.render("orders/edit", context);
    });
  });
  
  // update
  router.put("/:id", function (req, res) {
    db.Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
      function (err, updatedOrder) {
        if (err) {
          console.log(err);
          return res.send(err);
        }
        res.redirect(`/orders/${updatedOrder._id}`);
      }
    );
  });
  
  // delete
  router.delete("/:id", function (req, res) {
    db.Order.findByIdAndDelete(req.params.id, function (err, deletedOrder) {
      if (err) {
        console.log(err);
        return res.send(err);
      }
  
      db.User.findById(deletedOrder.user, function (err, foundUser) {
        if (err) {
          console.log(err);
          return res.send(err);
        }
  
        foundUser.orders.remove(deletedOrder);
        foundUser.save();
  
        res.redirect("/orders");
      });
    });
  });
  
module.exports = router;
