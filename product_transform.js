
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//this file contains a snapshot of code that will support the transformation of a csv file of tops from Celerant to the proper format for Reaction's product Schema.
//Still not 100% complete. 10/27/16 -kv


//
// var express = require('express');
// var router = express.Router();
var mongoose = require('mongoose');
var jsonpath = require('JSONpath');
var transform = require('jsonpath-object-transform');
var fs = require('file-system');
var csvtojson = require('csvtojson');
var Top = require('./index.js');
// var async = require('async');
//Converter Class
var Converter = require('csvtojson').Converter;
var converter = new Converter({});


require("fs").createReadStream("testTops.csv").pipe(converter);
var data;



//end_parsed will be emitted once parsing finished
converter.on("end_parsed", function(tops) {

    var testHash = [];
    var testMetafield = [];
    var newMetafield = {};
    var testGrab = function() {


        for (var i = 0; i < tops.length; i++) {

            var tempTop = tops[i];
            tempTop.isVisible = true;
            tempTop.isSoldOut = false;
            tempTop.isDeleted = false;
            tempTop.shopId = 'J8Bhq3uTtdgwZx3rz';

            tempTop.hashtags = [];
            tempTop.metafields = [];
            tempTop.newMetafield = [];
            if (typeof tempTop.brand === 'undefined') {
                tempTop.brand === null
            };
            if (typeof tempTop.dept === 'undefined') {
                tempTop.dept === null
            };
            if (typeof tempTop.inventorytype === 'undefined') {
                tempTop.inventorytype === null
            };
            if (typeof tempTop.sale === 'undefined' || tempTop.sale === 'N') {
                tempTop.sale = null
            } else {
                tempTop.sale == 'sale'
            };
            if (typeof tempTop.topseller === 'undefined' || tempTop.topseller === 'N') {
                tempTop.topseller = null
            } else {
                tempTop.topseller = 'topseller'
            };
            if (typeof tempTop.justin === 'undefined' || tempTop.justin === 'N') {
                tempTop.justin = null
            } else {
                tempTop.justin = 'justin'
            };
            if (typeof tempTop.meganpick === 'undefined' || tempTop.meganpick === 'N') {
                tempTop.meganpick = null
            } else {
                tempTop.meganpick = 'meganpick'
            };
            if (typeof tempTop.finds === 'undefined' || tempTop.finds === 'N') {
                tempTop.finds = null
            } else {
                tempTop.finds = 'finds'
            };
            if (typeof tempTop.exclusive === 'undefined') {
                tempTop.exclusive = null
            } else if (tempTop.exclusive === 'N') {
                tempTop.exclusive = null
            } else {
                tempTop.exclusive = 'exclusive'
            };
            testHash = tempTop.hashtags;
            testHash.push(
                tempTop.brand,
                tempTop.dept,
                tempTop.inventorytype,
                tempTop.sale,
                tempTop.topseller,
                tempTop.justin,
                tempTop.meganpick,
                tempTop.exclusive,
                tempTop.finds);
            console.log('here is a testHash that has finds', testHash);

            testMetafield = tempTop.metafields;
            testMetafield.push(tempTop.hexlist, tempTop.sizelist);
            console.log('here is the first testMetafield:', testMetafield);
            //
            // function toObject(testMetafield) {
            //   var rv = {};
            //   for (var i = 0; i < testMetafield.length; ++i)
            //     rv[i] = testMetafield[i];
            //     console.log('Metafield array to object', rv);
            //   return rv;
            // };
            //
            tempTop.newMetafield = testMetafield.reduce(function(testMetafield, item, index) {
              testMetafield[index] = item;
              console.log('reducing Metafield array:', testMetafield);
              return testMetafield;

            }, {});

        }
        return testHash;
        return newMetafield;

    };
    testGrab();


    // });

    console.log('myjsonArraywith hashTest/data:', tops); //here is your result jsonarray
    //below we loop through each document/product and transform it individually.  result is just ONE product transformed.
    for (var i = 0; i < tops.length; i++) {

        var data = tops[i];
        var result = transform(data, template);
        console.log("mapping data from example to template:", result);


        //below is just saving the tops to the Test mongoDB//
        var top1 = new Top(result);
        top1.save(function(err, topObject) {
            if (err) {
                console.log(err, 'you have an error saving');
            } else {
                console.log(topObject, 'you have saved it!');
            }
        });
    }
    saveData(result);
    return result;

});



var template = {
    _id: '$..id',
    ancestors: [""],
    shopId: '$..shopId',
    title: '$..name',
    pageTitle: "",
    description: "",
    type: "",
    vendor: '$..brand',
    // metafields: ['$..metafields'],
    metafields: ['$..newMetafield'],
    // metafields: '$...item',
    positions: "",
    price: '$..listprice',
    isLowQuantity: false,
    isSoldOut: '$..isSoldOut',
    isBackorder: true,
    requiresShipping: true,
    parcel: '$..shippingsurcharge',
    hashtags: [],
    twitterMsg: "",
    facebookMsg: "",
    googleplusMsg: "",
    pinterestMsg: "",
    metaDescription: "",
    handle: 'slug goes here',
    isDeleted: '$..isDeleted',
    isVisible: '$..isVisible',
    templateSuffix: "",
    createdAt: Date,
    // updatedAt: ,
    // publishedAt: ,
    publishedScope: "",
    workflow: ""

};


var saveData = function(result) {
  var arr = [];
  var JSONResult = JSON.stringify(result);
   fs.writeFile('/Users/katherinevogel/Codespace/reaction/custom/fileProducts.json', JSONResult, function(err, data){
    if (err) {
      console.log('error with your data file export', err);
    }

    console.log('It has been saved as a file, yo!', JSONResult);

  });
  return JSONResult;
};


//Then check for the ID of each of those values by matching to existing tag._id's.
// autoValue: function (){
//   let newTagId = Meteor.call("shop/createTag", tag.name, !tag._id);
//   if (this.tags).value = tags.title..
//
//const matchProducts = Products.find({$in:{hashtags: tag._id}});
//       // Product.update({_id: matchProducts._id}, {$addToSet:{hashtags:newTagId}})
//     }
