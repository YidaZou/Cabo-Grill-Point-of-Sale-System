const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
const bodyParser = require("body-parser");
const router = express.Router()
var urlencodedParser = bodyParser.urlencoded({ extended: false })  


// Create express app
const app = express();
const port = 3000;

// Create pool
const pool = new Pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: process.env.PSQL_PORT,
    ssl: {rejectUnauthorized: false}
});


// Add process hook to shutdown pool
process.on('SIGINT', function() {
    pool.end();
    console.log('Application successfully shutdown');
    process.exit(0);
});

app.set("view engine", "ejs");

app.use(express.static('public'));

/*
app.get('/', (req, res) => {
    const data = {name: 'Mario'};
    res.render('index', data);
});
*/

app.get('/403', (req, res) => {
    res.render('403');
});

app.get('/signin', (req, res) => {
    res.render('signin');
});

app.get('/', (req, res) => {
    res.render('signin')
});

employeeID = 0;
menu = [];
seasonalItems = [];
var transactionID = 0;
var previousTransaction = 0;
app.get('/order', (req, res) => {
    menu = [];
    seasonalItems = [];
    pool
        .query('SELECT * FROM menu;')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                menu.push(query_res.rows[i]);

                let curName = query_res.rows[i].itemname
                if(curName != "vegetableBurrito" && curName != "vegetableTaco" && curName != "vegetableBowl"
                && curName != "chickenBurrito" && curName != "chickenTaco" && curName != "chickenBowl"
                && curName != "beefBurrito" && curName != "beefTaco" && curName != "beefBowl"
                && curName != "steakBurrito" && curName != "steakTaco" && curName != "steakBowl"
                && curName != "chipsQueso" && curName != "chipsGuac" && curName != "chipsSalsa"
                && curName != "drink")
                {
                    seasonalItems.push(query_res.rows[i]);
                }
            }
            const data = {menu: menu, seasonalItems: seasonalItems};
            console.log(data);
            res.render('order', data);
            //res.render('index', {teammembers: teammembers}); 
    });
    pool
        .query("select * FROM transactions ORDER BY transactionid DESC LIMIT 1;")
        .then(query_res => {
            transactionID = query_res.rows[0].transactionid + 1;
    });
});


app.post('/process_order', urlencodedParser, function (req, res) {  
    var menuItems = req.body.menuItemsString.split(" ");
    var totalCart = req.body.totalCartString
    var orderPrices = "";
    var totalPrice = 0.0;


    const start = Date.now();
    let now = start;
    while (now - start < 1000) {
      now = Date.now();
    }
    console.log(transactionID);
    
    for(i in menuItems){
        for(j in menu){
            if(menu[j].itemname == menuItems[i]){
                orderPrices += menu[j].price + " ";
                totalPrice += menu[j].price;
            }
        }
    }
    totalPrice = totalPrice.toFixed(2);


    const date = new Date(Date.now());
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var hour = date.getHours();
    var minute = date.getMinutes() + 1;
    var seconds = date.getSeconds() + 1;
    if(day < 10){
        day = "0" + day;
    }
    if(month < 10){
        month = "0" + month;
    }
    if(hour < 10){
        hour = "0" + hour;
    }
    if(minute < 10){
        minute = "0" + minute;
    }
    if(seconds < 10){
        seconds = "0" + seconds;
    }
    var orderDate = "" + date.getFullYear() + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + seconds;

    var sqlStatement = "INSERT INTO orders (orderdate, totalPrice, orderItems, orderPrices, orderingredients, employeeID) VALUES (";
    sqlStatement +=  "'" + orderDate + "', " + totalPrice + ", '" + req.body.menuItemsString + "', '" + orderPrices + "', '" + totalCart + "', 0";
    sqlStatement += ")";
    console.log(sqlStatement);
    pool
        .query(sqlStatement)
        .then(query_res => {
            console.log("uploaded transaction");
    });

    /*
    for(i in totalCart){
        pool
            .query("SELECT * FROM supply WHERE supplyname = '" + totalCart[i] +"'")
            .then(query_res => {
                var supplyamount = query_res.rows[0].stock - .1;
                pool
                    .query("UPDATE supply SET stock = " + supplyamount + " WHERE supplyname = '" + totalCart[i] + "'");
        });
    }
    */
 });

orderList = []
supplyList = []
menuList = []
supplyNames = [];
seasonalItemsList = [];
//SIGNIN : RENDER SERVER/MANAGER
app.post('/process_signin', urlencodedParser, function (req, res) {  
    var pass = req.body.pass;
    var id = req.body.id;
    pool
        .query("SELECT * FROM employee;")
        .then( query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                if(query_res.rows[i].employeeid == id && query_res.rows[i].employeename == pass){
                    employeeID = id;

                    if(query_res.rows[i].position == "Server"){
                        app.get('/serverOrder', (req, res) => {
                            orderList = [];
                            supplyNames = [];
                            menuList = [];
                            seasonalItemsList = [];
                                pool
                                    .query("select * FROM transactions ORDER BY transactionid DESC LIMIT 1;")
                                    .then(query_res => {
                                        transactionID = query_res.rows[0].transactionid + 1;
                                });
                                pool
                                    .query("SELECT * FROM orders;")
                                    .then(query_res2 => {
                                        for (let i = 0; i < query_res2.rowCount; i++){
                                            orderList.push(query_res2.rows[i]);
                                        }
                                        pool
                                            .query("SELECT * FROM supply;")
                                            .then(query_res3 => {
                                                for (let i = 0; i < query_res3.rowCount; i++){
                                                    supplyNames.push(query_res3.rows[i].supplyname);
                                                }
                                                pool
                                                    .query('SELECT * FROM menu;')
                                                    .then(query_res => {
                                                        for (let i = 0; i < query_res.rowCount; i++){
                                                            menuList.push(query_res.rows[i]);
                                                            let curName = query_res.rows[i].itemname
                                                            if(curName != "vegetableBurrito" && curName != "vegetableTaco" && curName != "vegetableBowl"
                                                            && curName != "chickenBurrito" && curName != "chickenTaco" && curName != "chickenBowl"
                                                            && curName != "beefBurrito" && curName != "beefTaco" && curName != "beefBowl"
                                                            && curName != "steakBurrito" && curName != "steakTaco" && curName != "steakBowl"
                                                            && curName != "chipsQueso" && curName != "chipsGuac" && curName != "chipsSalsa"
                                                            && curName != "drink")
                                                            {
                                                                seasonalItemsList.push(query_res.rows[i]);
                                                            }
                                                        }

                                                        const o = {supplyList: supplyList, menuList: menuList, seasonalItems: seasonalItemsList};
                                                        //console.log(o);
                                                        res.render('serverOrder', o);
                                                });

                                        })
                                        
                                    })
                        });
                        res.redirect('/serverOrder');
                    }else if(query_res.rows[i].position == "Manager"){
                        app.get('/manager', (req, res) => {
                            supplyList = []
                            menuList = []
                            supplyNames = [];
                                pool
                                    .query("SELECT * FROM supply;")
                                    .then(query_res3 => {
                                        for (let i = 0; i < query_res3.rowCount; i++){
                                            supplyList.push(query_res3.rows[i]);
                                            supplyNames.push(query_res3.rows[i].supplyname);
                                        }
                                        pool
                                            .query("SELECT * FROM menu;")
                                            .then(query_res4 => {
                                                for (let i = 0; i < query_res4.rowCount; i++){
                                                    menuList.push(query_res4.rows[i]);
                                                }
                                                const m = {supplyList: supplyList, menuList: menuList}
                                                console.log(m)
                                                res.render('manager', m);
                                        })
                                    })
                            
                        });
                        
                        res.redirect('/manager');
                    }
                    console.log("success");
                    return;
                }
            }
            console.log("failed");
            res.redirect('signin');
        });
 });

 app.post('/approve_order', urlencodedParser, function (req, res) {
    var order = orderList[parseInt(req.body.approve)];

    console.log(order);

    if(previousTransaction == transactionID){
        transactionID++;
    }

    const date = new Date(order.orderdate);
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var hour = date.getHours();
    var minute = date.getMinutes();
    var seconds = date.getSeconds();
    if(day < 10){
        day = "0" + day;
    }
    if(month < 10){
        month = "0" + month;
    }
    if(hour < 10){
        hour = "0" + hour;
    }
    if(minute < 10){
        minute = "0" + minute;
    }
    if(seconds < 10){
        seconds = "0" + seconds;
    }
    var orderDate = "" + date.getFullYear() + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + seconds;

    var sqlStatement = "INSERT INTO transactions (transactionid, totalPrice, orderItems, orderPrices, orderdate, employeeID) VALUES (";
    sqlStatement +=  "" + transactionID + ", " + order.totalprice + ", '" + order.orderitems + "', '" + order.orderprices + "', '" + orderDate + "', " + employeeID;
    sqlStatement += ")";

    //console.log(sqlStatement);
    pool
        .query(sqlStatement)
        .then(query_res => {
            console.log("uploaded transaction");
            previousTransaction = transactionID;
    });

    ingredients = order.orderingredients.split(" ");
    console.log(ingredients);
    console.log(supplyNames);
    for(let i = 0; i < ingredients.length; i++){
        console.log("i = " + i + ": " + ingredients[i]);
        if(supplyNames.includes(ingredients[i]) && (ingredients[i] != "" && ingredients[i] != " ")){
            sqlStatement = "SELECT stock FROM supply WHERE supplyname = '" + ingredients[i] + "';";
            console.log(sqlStatement);
            pool
                .query(sqlStatement)
                .then(query_res => {
                    stockNum = query_res.rows[0].stock;
                    sqlStatement = "UPDATE " + "supply" + " SET stock = "+ (stockNum-1) +  " WHERE supplyname = '" + ingredients[i] + "';";
                    console.log(sqlStatement);
                    pool
                        .query(sqlStatement)
                        .then(query_res => {
                            console.log("decremented " + ingredients[i] + " by 1");
                    });
            });
        }
        else{
            console.log("does not contain " + ingredients[i]);
        }
    }

    sqlStatement = "DELETE FROM orders WHERE orderdate = '" + orderDate + "';";
    //console.log(sqlStatement);
    pool
        .query(sqlStatement)
        .then(query_res => {
            console.log("deleted order");
            res.redirect("/serverOrder");
    });

  });

  app.post('/deny_order', urlencodedParser, function (req, res) {
    var order = orderList[parseInt(req.body.deny)];

    console.log(order);

    if(previousTransaction == transactionID){
        transactionID++;
    }

    const date = new Date(order.orderdate);
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var hour = date.getHours();
    var minute = date.getMinutes();
    var seconds = date.getSeconds();
    if(day < 10){
        day = "0" + day;
    }
    if(month < 10){
        month = "0" + month;
    }
    if(hour < 10){
        hour = "0" + hour;
    }
    if(minute < 10){
        minute = "0" + minute;
    }
    if(seconds < 10){
        seconds = "0" + seconds;
    }
    var orderDate = "" + date.getFullYear() + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + seconds;

    var sqlStatement = "DELETE FROM orders WHERE orderdate = '" + orderDate + "';";
    console.log(sqlStatement);
    pool
        .query(sqlStatement)
        .then(query_res => {
            console.log("deleted order");
            res.redirect("/serverOrder");
    });

  });

  app.post('/transaction', urlencodedParser, function (req, res) {
    var menuItems = req.body.menuItemsString.split(" ");
    var totalCart = req.body.totalCartString.split(" ");
    var orderPrices = "";
    var totalPrice = 0.0;
    if(previousTransaction == transactionID){
        transactionID++;
    }


    const start = Date.now();
    let now = start;
    while (now - start < 1000) {
      now = Date.now();
    }
    console.log(transactionID);

    for(i in menuItems){
        for(j in menu){
            if(menu[j].itemname == menuItems[i]){
                orderPrices += menu[j].price + " ";
                totalPrice += menu[j].price;
            }
        }
    }
    totalPrice = totalPrice.toFixed(2);


    const date = new Date(Date.now());
    var day =  date.getDate();
    var month = date.getMonth() + 1;
    var hour = date.getHours();
    var minute = date.getMinutes() + 1;
    var seconds = date.getSeconds() + 1;
    if(day < 10){
        day = "0" + day;
    }
    if(month < 10){
        month = "0" + month;
    }
    if(hour < 10){
        hour = "0" + hour;
    }
    if(minute < 10){
        minute = "0" + minute;
    }
    if(seconds < 10){
        seconds = "0" + seconds;
    }
    var orderDate = "" + date.getFullYear() + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + seconds;

    var sqlStatement = "INSERT INTO transactions (transactionID, totalPrice, orderItems, orderPrices, orderDate, employeeID) VALUES (";
    sqlStatement += transactionID + ", " + totalPrice + ", '" + req.body.menuItemsString + "', '" + orderPrices + "', '" + orderDate + "', " + employeeID;
    sqlStatement += ")";
    console.log(sqlStatement);
    pool
        .query(sqlStatement)
        .then(query_res => {
            console.log("uploaded transaction");
            previousTransaction = transactionID;
    });



    ingredients = totalCart
    console.log(ingredients);
    console.log(supplyNames);
    for(let i = 0; i < ingredients.length; i++){
        console.log("i = " + i + ": " + ingredients[i]);
        if(supplyNames.includes(ingredients[i]) && (ingredients[i] != "" && ingredients[i] != " ")){
            sqlStatement = "SELECT stock FROM supply WHERE supplyname = '" + ingredients[i] + "';";
            console.log(sqlStatement);
            pool
                .query(sqlStatement)
                .then(query_res => {
                    stockNum = query_res.rows[0].stock;
                    sqlStatement = "UPDATE " + "supply" + " SET stock = "+ (stockNum-1) +  " WHERE supplyname = '" + ingredients[i] + "';";
                    console.log(sqlStatement);
                    pool
                        .query(sqlStatement)
                        .then(query_res => {
                            console.log("decremented " + ingredients[i] + " by 1");
                    });
            });
        }
        else{
            console.log("does not contain " + ingredients[i]);
        }
    }

  });


salesReport = []
//SALES REPORT
app.post('/process_sales', urlencodedParser, function (req, res) {
    salesReport = []
    var time1 = req.body.time1;
    var time2 = req.body.time2;
    console.log(time1)
    console.log(time2)
    menuList.forEach(item =>{ 
        sqlStatement = "SELECT count(*) FROM transactions WHERE orderitems LIKE '%" + item.itemname + "%' AND orderdate BETWEEN '" + time1 + "'AND'" + time2 + "';"
        console.log(item.itemname)
        pool
            .query(sqlStatement)
            .then(query_res =>{
                salesReport.push([item.itemname, query_res.rows[0].count, (item.price*query_res.rows[0].count).toFixed(2)])

            })
    })
    setTimeout(function(){
        salesReport.sort((a,b) => b[1] - a[1])
        const sR = {salesReport: salesReport}
        res.render("./salesReport", sR)
        console.log(salesReport)
        console.log(sR)
    },2000);
})

salesTogetherReport = []
//WHAT SALES TOGETHER REPORT
app.post('/process_salesTogether', urlencodedParser, function (req, res) {
    salesTogetherReport = []
    menuPairs = []
    //make pairs
    for(let i = 0; i < menuList.length; i++){
        for(let j = i+1; j<menuList.length; j++) {
            menuPairs.push([menuList[i], menuList[j]])
        }
    }

    var time1b = req.body.time1b;
    var time2b = req.body.time2b;
    console.log(time1b)
    console.log(time2b)

    menuPairs.forEach(item =>{ 
        sqlStatement = "SELECT count(*) FROM transactions WHERE orderitems LIKE " +
                "'%" + item[0].itemname + "%' AND orderitems LIKE '%" + item[1].itemname + "%' AND orderdate BETWEEN '" + time1b + "'AND'" + time2b + "';";
        pool
            .query(sqlStatement)
            .then(query_res =>{
                if(query_res.rows[0].count != 0){
                    salesTogetherReport.push([item[0].itemname + " " + item[1].itemname, query_res.rows[0].count, ((item[0].price + item[1].price)*query_res.rows[0].count).toFixed(2)])
                }
            })
    })
    setTimeout(function(){
        salesTogetherReport.sort((a,b) => b[1] - a[1])
        const sTR = {salesTogetherReport: salesTogetherReport}
        res.render("./salesTogetherReport", sTR)
        console.log(salesTogetherReport)
        console.log(sTR)
    },2000);
    
})

excessReport = []
//EXCESS REPORT
app.post('/process_excess', urlencodedParser, function (req, res) {
    tempReport = [];

    suppliesUsed = [];
    for(i = 0; i < supplyNames.length; i++){
        suppliesUsed.push(0);
    }

    var time1 = req.body.time1;
    var time2 = req.body.time2;
    console.log(time1)
    console.log(time2)

    menuList.forEach(item =>{ 
        statement = "SELECT count(*) FROM transactions WHERE orderitems LIKE '%" + item.itemname + "%' AND orderdate BETWEEN '" + time1 + "'AND'" + time2 + "';"
        console.log(item.itemname)
        pool
            .query(statement)
            .then(query_res =>{
                tempReport.push([item, query_res.rows[0].count])
                /*
                if(i == menuList.length-1){
                    const sR = {salesReport: salesReport}
                    res.render("./salesReport", sR)
                    res.redirect("./salesReport")
                }
                */
            })
    })
    
    setTimeout(function(){
        tempReport.forEach(item =>{
            ingredients = item[0].supplies.split(" ");

            ingredients.forEach(supply =>{
                if(supplyNames.includes(supply)){
                    suppliesUsed[supplyNames.indexOf(supply)] += .1 * item[1];
                }
            })

        })

        for(i = 0; i < supplyList.length; i++){
            if(suppliesUsed[supplyNames.indexOf(supplyList[i].supplyname)] < (.1 * supplyList[i].stock)){
                excessReport.push([supplyList[i].supplyname, suppliesUsed[supplyNames.indexOf(supplyList[i].supplyname)]]);
            }
        }

        const eR = {excessReport: excessReport}
        res.render("./excessReport", eR)
        console.log(excessReport)
        console.log(eR)
    },2000);
    
})

//UPDATE SUPPLY STOCK AMOUNT
app.post('/process_updateStock', urlencodedParser, function (req, res) {
    var amount = req.body.amount;
    var stockName = req.body.stockName;
    sqlStatement = "UPDATE " + "supply" + " SET stock = "+ amount +  "WHERE supplyname = '" + stockName + "';";
    pool
        .query(sqlStatement)
        .then(query_res =>{
            res.redirect("/manager");   //refresh manager view
        });
})

//UPDATE MENU ITEM PRICE
app.post('/process_updatePrice', urlencodedParser, function (req, res) {
    var price = req.body.price;
    var menuName = req.body.menuName;
    sqlStatement = "UPDATE " + "menu" + " SET price = "+ price +  "WHERE itemname = '" + menuName + "';";
    pool
        .query(sqlStatement)
        .then(query_res =>{
            res.redirect("/manager");
        });
})

//ADD NEW MENU ITEM
app.post('/process_addMenuItem', urlencodedParser, function (req, res) {
    var itemName = req.body.itemName;
    var price = req.body.newPrice;
    var supplies = req.body.supplies;
    sqlStatement = "INSERT INTO menu (itemname, price, supplies) VALUES ('"+ itemName + "', " + price + ", '" + supplies + "')";
    pool
        .query(sqlStatement)
        .then(query_res =>{
            res.redirect("/manager");
        });
})

//REMOVE MENU ITEM
app.post('/process_removeMenuItem', urlencodedParser, function (req, res) {
    var itemName = req.body.removeItemName;
    sqlStatement = "DELETE FROM menu WHERE itemName = '" + itemName + "'";
    pool
        .query(sqlStatement)
        .then(query_res =>{
            res.redirect("/manager");
        });
})

//ADD NEW SUPPLY ITEM
app.post('/process_addSupplyItem', urlencodedParser, function (req, res) {
    var supplyName = req.body.supplyName;
    var stock = req.body.stock;
    var vendor = req.body.vendor;
    sqlStatement = "INSERT INTO supply (supplyname, stock, vendor) VALUES ('" + supplyName + "', " + stock + ", '" + vendor + "')";
    pool
        .query(sqlStatement)
        .then(query_res =>{
            res.redirect("/manager");
        });
})

//REMOVE SUPPLY ITEM
app.post('/process_removeSupplyItem', urlencodedParser, function (req, res) {
    var supplyName = req.body.removeItemName;
    sqlStatement = "DELETE FROM supply WHERE supplyname = '" + supplyName + "'";
    pool
        .query(sqlStatement)
        .then(query_res =>{
            res.redirect("/manager");
        });
})

restockReport = []
app.post('/process_restock', urlencodedParser, function (req, res) {
    restockReport = []
    statement = "SELECT * FROM supply WHERE stock < 50;"
    pool
        .query(statement)
        .then(query_res =>{
            console.log(query_res)
            for(let i = 0; i < query_res.rowCount; i++){
                console.log(i)
                restockReport.push([query_res.rows[i].supplyname, query_res.rows[i].stock])
                
            }
            const rR = {restockReport: restockReport}
            res.render("./restock", rR);
            //res.redirect("/restock")
            
        });
    
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.end();
});
