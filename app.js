const express = require("express");
const axios = require("axios");
var urlExists = require("url-exists");

const port = process.env.PORT || 5000;

var mysql = require("mysql");

var con = mysql.createConnection({
  host: "35.198.129.152",
  database: "testing",
  user: "mguner",
  password:
    "9s5ZxHp?wYgm&z_T_9?t8@CWStDh=XxpQtv8E?@f^nXdfk4&m-_^??-s&Zs?GNhg&T",
});

const app = express();
try {
  con.connect();
} catch (error) {
  console.log("connection error", error);
}

app.listen(port, () => {
  console.log("getStarted", new Date());
  setInterval(() => {
    getData()
      .then((response) => {
        for (let i = 0; i < response.length; i++) {
          urlExists(response[i]['website'], function (err, exists) {
            updateData(response[i]['id'],exists)
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, 60000);
});

function getData() {
  return new Promise(async (resolve, reject) => {
    try {
      con.query(
        `select id,website from german_companies
          where website is not null and
          website_checked is null LIMIT 1000` ,
        function (err, result) {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    } catch (error) {
      console.log("couldn't get data");
    }
  });
}
function updateData(id,update){
  if (update) {
    try {
      con.query(
        `Update german_companies
          SET website_checked = 1
          where id = "${id}"` ,
          function (err) {
            if (err) {
              console.log(err);
            } 
          }
      );
    } catch (error) {
      console.log("couldn't get data");
    }
  } else {
    try {
      con.query(
        `Update german_companies
        SET website_checked = 0
        where id = "${id}"` ,
        function (err) {
          if (err) {
            console.log(err);
          } 
        }
      );
    } catch (error) {
      console.log("couldn't get data");
    }
  }
    
}