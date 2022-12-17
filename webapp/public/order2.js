/**
 * unclicks other entrees if bowl is clicked
 */
function clickBowl() {
	if (document.getElementById("bowl").checked) {
		document.getElementById("burrito").checked = false;
        document.getElementById("taco").checked = false;
	}
}

/**
 * unclicks other entrees if burrito is clicked
 */
function clickBurrito() {
	if (document.getElementById("burrito").checked) {
		document.getElementById("bowl").checked = false;
        document.getElementById("taco").checked = false;
	}
}

/**
 * unclicks other entrees if taco is clicked
 */
function clickTaco() {
	if (document.getElementById("taco").checked) {
		document.getElementById("bowl").checked = false;
        document.getElementById("burrito").checked = false;
	}
}

/**
 * unclicks other proteins if chicken is clicked
 */
function clickChicken() {
	if (document.getElementById("chicken").checked) {
		document.getElementById("beef").checked = false;
        document.getElementById("steak").checked = false;
        document.getElementById("veg").checked = false;
	}
}

/**
 * unclicks other proteins if beef is clicked
 */
function clickBeef() {
	if (document.getElementById("beef").checked) {
		document.getElementById("chicken").checked = false;
        document.getElementById("steak").checked = false;
        document.getElementById("veg").checked = false;
	}
}

/**
 * unclicks other proteins if steak is clicked
 */
function clickSteak() {
	if (document.getElementById("steak").checked) {
		document.getElementById("chicken").checked = false;
        document.getElementById("beef").checked = false;
        document.getElementById("veg").checked = false;
	}
}

/**
 * unclicks other proteins if veg is clicked
 */
function clickVeg() {
	if (document.getElementById("veg").checked) {
		document.getElementById("chicken").checked = false;
        document.getElementById("beef").checked = false;
        document.getElementById("steak").checked = false;
	}
}

/**
 * unclicks other rices if white rice is clicked
 */
function clickWhite()
{
    if (document.getElementById("white").checked) {
		document.getElementById("brown").checked = false;
	}
}

/**
 * unclicks other rices if brown rice is clicked
 */
function clickBrown()
{
    if (document.getElementById("brown").checked) {
		document.getElementById("white").checked = false;
	}
}

let menuItems = []; //entree, protein and drinks/chips
let totalCart = [];
var menu;
var price = 0;

/**
 * adds items checked to the cart
 */
function addToCart()
{
  document.getElementById("error").innerHTML = "";
  price = 0;
  let priceArray = []; //each menu item price

  let cart = []; //has everything

  let proteinEntree = "";


  //proteins
  proteinChecked = false;
  var checkChicken = document.getElementById("chicken"); //checking if chicken is checked
  if(checkChicken.checked == true)
  {
    cart.push("chicken");
    totalCart.push("chicken");

    proteinChecked = true;
    proteinEntree += "chicken";
  }

  var checkBeef = document.getElementById("beef"); //checking if beef is checked
  if(checkBeef.checked == true)
  {
    cart.push("beef");
    totalCart.push("beef");

    proteinChecked = true;

    proteinEntree += "beef";
  }
  var checkSteak = document.getElementById("steak"); //checking if steak is checked
  if(checkSteak.checked == true)
  {
    cart.push("steak");
    totalCart.push("steak");

    proteinChecked = true;
    proteinEntree += "steak";
  }
  var checkVeg = document.getElementById("veg"); //checking if veg is checked
  if(checkVeg.checked == true)
  {
    cart.push("vegetable");
    totalCart.push("vegetableMedley");

    proteinChecked = true;
    proteinEntree += "vegetable";
  }

  //entrees

  entreePicked = false;
  var checkBurrito = document.getElementById("burrito"); //checking if burrito is checked
  if(checkBurrito.checked == true)
  {
    cart.push("burrito");
    totalCart.push("tortilla");

    entreePicked = true;
    proteinEntree += "Burrito";
  }
  var checkBowl = document.getElementById("bowl"); //checking if bowl is checked
  if(checkBowl.checked == true)
  {
    cart.push("bowl");
    totalCart.push("bowl");

    entreePicked = true;
    proteinEntree += "Bowl";
  }
  var checkTaco = document.getElementById("taco"); //checking if taco is checked
  if(checkTaco.checked == true)
  {
    cart.push("taco");
    totalCart.push("tacoTortilla");

    entreePicked = true;
    proteinEntree += "Taco";
  }


  //rice
  riceChecked = false;

  var checkWhite = document.getElementById("white"); //checking if rice is checked
  if(checkWhite.checked == true)
  {
    cart.push("whiteRice");
    totalCart.push("rice");

    riceChecked = true;
  }

  var checkBrown = document.getElementById("brown"); //checking if rice is checked
  if(checkBrown.checked == true)
  {
    cart.push("brownRice");
    totalCart.push("rice");

    riceChecked = true;
  }


  if(!proteinChecked && (riceChecked || entreePicked)){
    document.getElementById("error").innerHTML = "Please select a protein";
    clearCart();
    return;
  }
  if(!entreePicked && (riceChecked || proteinEntree)){
    document.getElementById("error").innerHTML = "Please select an entree";
    clearCart();
    return;
  }
  if(!riceChecked && (entreePicked || proteinEntree)){
    document.getElementById("error").innerHTML = "Please select a rice";
    clearCart();
    return;
  }

  //add ons
  var checkCheese = document.getElementById("cheese"); //checking if cheese is checked
  if(checkCheese.checked == true)
  {
    cart.push("cheese");
    totalCart.push("cheese");

  }
  var checkCorn = document.getElementById("corn"); //checking if corn is checked
  if(checkCorn.checked == true)
  {
    cart.push("corn");
    totalCart.push("corn");

  }
  var checkRedSalsa = document.getElementById("redSalsa"); //checking if redsalsa is checked
  if(checkRedSalsa.checked == true)
  {
    cart.push("redSalsa");
    totalCart.push("salsa");

  }
  var checkGreenSalsa = document.getElementById("greenSalsa"); //checking if greensalsa is checked
  if(checkGreenSalsa.checked == true)
  {
    cart.push("greenSalsa");
    totalCart.push("salsa");

  }
  var checkLettuce = document.getElementById("lettuce"); //checking if lettuce is checked
  if(checkLettuce.checked == true)
  {
    cart.push("lettuce");
    totalCart.push("lettuce");

  }
  var checkGuac = document.getElementById("guac"); //checking if guac is checked
  if(checkGuac.checked == true)
  {
    cart.push("guac");
    totalCart.push("guac");

  }
  var checkSourCream = document.getElementById("sourCream"); //checking if sourcream is checked
  if(checkSourCream.checked == true)
  {
    cart.push("sourCream");
    totalCart.push("sourCream");

  }
  var checkChipsQueso = document.getElementById("chipsQuesos"); //checking if chips and queso are checked
  if(checkChipsQueso.checked == true)
  {
    cart.push("chipsQueso");
    totalCart.push("queso");
    totalCart.push("chips");
    menuItems.push("chipsQueso");
  }
  var checkChipsGuac = document.getElementById("chipsGuacs"); //checking if chips and quac are checked
  if(checkChipsGuac.checked == true)
  {
    cart.push("chipsGuac");
    totalCart.push("guac");
    totalCart.push("chips");
    menuItems.push("chipsGuac");
  }
  var checkChipsSalsa = document.getElementById("chipsSalsas"); //checking if chips and salsa are checked
  if(checkChipsSalsa.checked == true)
  {
    cart.push("chipsSalsa");
    totalCart.push("salsa");
    totalCart.push("chips");
    menuItems.push("chipsSalsa");
  }
  var checkDrink = document.getElementById("drinks"); //checking if drink is checked
  if(checkDrink.checked == true)
  {
    cart.push("drink");
    totalCart.push("drink");
    menuItems.push("drink");
  }

  season = document.getElementsByClassName("season");
  Array.from(season).forEach(function(element) {
      if(document.getElementById("seasonal" + element.innerHTML).checked == true){
        console.log(element.innerHTML);
        cart.push(element.innerHTML);
        menuItems.push(element.innerHTML);
        supplies = document.getElementById("supply" + element.innerHTML).innerHTML.split(" ")
        for(i = 0; i < supplies.length; i++){
          totalCart.push(supplies[i]);
        }
      }
  });

  let list = document.getElementById("myList"); //updating the list with checked boxes
  cart.forEach((item)=>{
    let li = document.createElement("li");
    li.innerText = item;
    list.appendChild(li);
	let br = document.createElement("br");
	list.appendChild(br);
  })


  // var checkbox = document.getElementById("lettuce");
  // if (checkbox.checked == true){
  //   var element = document.getElementById("lettuceID");
  //   element.style.fontWeight = "bold";

  // }
  checkBurrito.checked = false;
  checkBowl.checked = false;
  checkTaco.checked = false;
  checkChicken.checked = false;

  checkBeef.checked = false;
  checkSteak.checked = false;
  checkVeg.checked = false;
  checkWhite.checked = false;

  checkBrown.checked = false;
  checkCheese.checked = false;
  checkCorn.checked = false;
  checkRedSalsa.checked = false;

  checkGreenSalsa.checked = false;
  checkSourCream.checked = false;
  checkLettuce.checked = false;
  checkGuac.checked = false;

  checkChipsQueso.checked = false;
  checkChipsSalsa.checked = false;
  checkChipsGuac.checked = false;
  checkDrink.checked = false;

  if(proteinEntree != '')
  {
    menuItems.push(proteinEntree);
  }
  console.log(cart);
  console.log(totalCart);
  console.log(proteinEntree);
  console.log(menuItems);

  for(i in menuItems){
    price += parseFloat(document.getElementById(menuItems[i]).innerHTML);
    console.log("Price of " + menuItems[i] + ": " + document.getElementById(menuItems[i]).innerHTML);
  }

  document.getElementById("price").innerHTML = "Current Price: $" + price.toFixed(2);

  var menuItemsString = "";  //orderitems
  var totalCartString = "";  //orderingredients
  for(i in menuItems){
    menuItemsString += menuItems[i] + " ";
  }
  for(i in totalCart){
    totalCartString += totalCart[i] + " ";
  }

  //out = [menuItemsString, totalCartString];
  console.log("added to cart");
  document.getElementById("menuItemsString").value = menuItemsString;
  document.getElementById("totalCartString").value = totalCartString;

}

/**
 * clears cart of all items checked
 */
function clearCart(){
  let list = document.getElementById("myList");
  list.innerText = "";
  menuItems = [];
  totalCart = [];
  document.getElementById("price").innerHTML = "";
  price = 0;
  document.getElementById("checkout").innerHTML = "";
}

/**
 * prints "Successfully Checked Out!" to checkout list
 */
function checkout(){
	document.getElementById("checkout").innerHTML = "Successfully Checked Out!";
}