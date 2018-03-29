/* Scraping into DB (18.2.5)
 * ========================== */
// 1. do cli command "use scraper" then db.scrapedData.insert({"title": "title", "link": "link"})
// Initialize Express app
// admindecisions
var express = require('express');
var app = express();

// Require request and cheerio. This makes the scraping possible
var request = require('request');
var cheerio = require('cheerio');

// Database configuration
var mongojs = require('mongojs');
var databaseUrl = "scraper";
var collections = ["scrapedDataBidowski"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on('error', function(err) {
  console.log('Database Error:', err);
});


// Main route (simple Hello World Message)
app.get('/', function(req, res) {
  res.send("Hello world");
});

// Retrieve data from the db
app.get('/all', function(req, res) {
  // find all results from the scrapedDataBidowski collection in the db
  db.scrapedDataBidowski.find().sort({td:1}, function(err, found) {
    // throw any errors to the console
    if (err) {
      console.log(err);
    } 
    // if there are no errors, send the data to the browser as a json
    else {
      res.json(found);
    }
  });
});

// Scrape data from one site and place it into the mongodb db
app.get('/scrape', function(req, res) {
  // make a request for the news section of ycombinator
  request('https://www.cms.gov/Regulations-and-Guidance/Review-Boards/OfficeAttorneyAdvisor/OAA-Decisions.html', function(error, response, html) {
    // load the html body from request into cheerio
    var $ = cheerio.load(html);
    // for each element with a "td" tag
    $('td').each(function(i, element) {
      // save the text of each link enclosed in the current element
      var td = $(this).text();
            // save the href value of each link enclosed in the current element
      var dn = $(this).children('a').text();
      // save the href value of each link enclosed in the current element
      var link = $(this).children().attr('href');

      // if this title element had both a title and a link
      // if (td && link) {
        // save the data in the scrapedData db
        db.scrapedDataBidowski.save({
          td: td,
          dn: dn,
          link: link
        }, 
        function(err, saved) {
          // if there's an error during this query
          if (err) {
            // log the error
            console.log(err);
          } 
          // otherwise, 
          else {
            // log the saved data
            console.log(saved);
          }
        });
      // }
    });
  });

  // this will send a "search complete" message to the browser
  res.send("Scrape Complete");
});


// listen on port 3000
app.listen(3000, function() {
  console.log('App running on port 3000!');
});




/* Students: Using the tools and techniques you learned so far,
 * you will scrape a website of your choice, then place the data
 * in a MongoDB database. Be sure to make the database and collection
 * before running this exercise.

 * Consult the assignment files from earlier in class
 * if you need a refresher on Cheerio. */

/* TODO: make two more routes
 * -/-/-/-/-/-/-/-/-/-/-/-/- */

// Route 1 
// =======
// This route will retrieve all of the data 
// from the scrapedData collection as a json (this will be populated
// by the data you scrape using the next route)


// Route 2
// =======
// When you visit this route, the server will
// scrape data from the site of your choice, and save it to
// MongoDB.
// TIP: Think back to how you pushed website data  
// into an empty array in the last class. How do you
// push it into a MongoDB collection instead?

/* -/-/-/-/-/-/-/-/-/-/-/-/- */