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
function clickBeef() { d
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


