		
	var currentUser = "";
	var user = {};
	var usersArray = [];
	var img = [];
	var imagesArray=[];
	
	function userNameIsValid(fName){
		var x = document.forms[fName]["username"].value;
		if(!/^[a-zA-Z]+$/.test(x)){
			return false;
		}
		return true;
	}
	function emailIsValid(fName){
		var x = document.forms[fName]["email"].value;
		var atpos = x.indexOf("@");
		var dotpos = x.lastIndexOf(".");
		var ret = ""; //"Not valid email: ";
		var tmp = "";
		if(atpos === -1)
			tmp += "   - missing '@' \n";
		if(dotpos === -1)
			tmp += "   - missing '.' \n";
		if(atpos < 1)
			tmp += "   - wrong position of '@' \n";
		if(atpos > dotpos)
			tmp += "   - wrong format of email string";
		if(tmp.length > 0)
			ret = "Not valid email: \n".concat(tmp);
		return ret;
	}
	
	function passwordIsValid(fName){
		var x = document.forms[fName]["pwd"].value;
		var vString = /^(?=.*[0-9]+)(?=.*[a-z]+)(?=.*[A-Z]+)[0-9a-zA-Z]{6,}$/;
		if(!vString.test(x)){
			return false;
		}
		return true;
	}

	function checkSignUp(){
		if(!userNameIsValid("fSignUp")){
			alert("not valid username");
			return false;
		}
		var tmp = emailIsValid("fSignUp");

		if(tmp.length > 1){
			alert(tmp);
			return false;
		}
		if(!passwordIsValid("fSignUp")){
			alert("Not valid password. \n\nRequired: - at least 6 characters long, \n          - at least one lowercase letter, \n          - one uppercase letter, \n          - one digit, \n          - no special symbols");
			return false;
		}
		return true;
	}
			
	function onSignUp(){
		var usr = document.forms["fSignUp"]["username"].value;
		var mail = document.forms["fSignUp"]["email"].value;
		var pwd ="";
		if(!checkSignUp())
			return;

		if(document.forms["fSignUp"]["pwd"].value === document.forms["fSignUp"]["reppwd"].value){
			pwd = document.forms["fSignUp"]["pwd"].value;
		}
		else{
			alert("Password doesn'n match");
			return;
		}
		var user = {"name": usr,
					"mail": mail,
					"passw": pwd,
					};
		usersArray.push(user);
		currentUser = mail;
		hideAccessWnd();
		document.getElementById("inout").setAttribute("src", "img/logout.png");
		document.getElementById("greet").innerHTML = "Hi, " + usr + "!";
		document.getElementById("addimage").style.display = "block";
	}
		
	function clearSignIn(){
		document.forms["fSignIn"]["email"].value = "";
		document.forms["fSignIn"]["pwd"].value = "";
	}
	
	function clearSignUp(){
		document.forms["fSignUp"]["username"].value = "";
		document.forms["fSignUp"]["email"].value = "";
		document.forms["fSignUp"]["pwd"].value = "";
		document.forms["fSignUp"]["reppwd"].value = "";
	}
	
	function hideAccessWnd(){
		clearSignIn();
		clearSignUp();
		document.getElementById("SignUp").style.display = "none";
		document.getElementById("SignIn").style.display = "block";
		document.getElementById("AccessWnd").style.display = "none";		
	}
	
	function onLogin(){
		var usr = document.forms["fSignIn"]["email"].value;
		if(usersArray.length === 0){
			clearSignIn();
			alert("Please, sign up. You have no account");
			document.getElementById("SignUp").style.display = "block";
			document.getElementById("SignIn").style.display = "none";
			return;
		}
		var obj = null;
		var i=0;
		for(i=0; i < usersArray.length; i++)
			if(usersArray[i]["mail"] === usr){
				obj = usersArray[i];
				break;
			}
		
		if(obj === null){
			alert("Incorrect E-mail address");
			clearSignIn();
			alert("Please, sign up. You have no account");
			document.getElementById("SignUp").style.display = "block";
			document.getElementById("SignIn").style.display = "none";
			return;
		} else if(document.forms["fSignIn"]["pwd"].value !== obj.passw){
			alert("incorrect password");
			document.forms["fSignIn"]["pwd"].value = "";
		}else{
			document.getElementById("greet").innerHTML = "Hi, " + obj.name + "!";
			currentUser = usr;
			hideAccessWnd();
			document.getElementById("inout").setAttribute("src", "img/logout.png");
			document.getElementById("addimage").style.display = "block";
		}
		loadUserData();
	}
		
	function access(){
		if(document.getElementById("inout").getAttributeNode("src").value === "img/logout.png"){
			currentUser = "undefined";
			tag_name = "";
			document.getElementById("greet").innerHTML = "";
			document.getElementById("inout").setAttribute("src", "img/login.png");
			document.getElementById("addimage").style.display = "none";
			var el = document.getElementById("imgContainer");
			var ss = el.getElementsByClassName("image").length;
			while(el.hasChildNodes()) {
				if(el.lastChild.id === "addimage")
					break;
				el.removeChild(el.lastChild);
			}
			fillContainer();
		}else{
			document.getElementById("AccessWnd").style.display = "block";
		}
	}	
		
	function close(){
		clearImage();
		document.getElementById("winadd").style.visibility = "hidden";
	}
	
	function open(){
		clearImage();
		document.getElementById("winadd").style.visibility = "visible";
	}
		
	function scrollFunction(){
		var scrollTop = $(document).scrollTop();
		var windowHeight = $(window).height();
		var bodyHeight = $(document).height() - windowHeight;
		var scrollPercentage = (scrollTop / bodyHeight);
		if(scrollPercentage === 1.0) {
			fillContainer();
			chooseByTag(tag_name);
		}
	}
		
	function clearImage(){
		document.getElementById("inputImage").setAttribute("src", "img/open.png");
		document.forms["fAddMedia"]["filename"].value = "";
		document.forms["fAddMedia"]["descr"].value = "";
		var el = document.getElementById("tagswnd");
		while (el.hasChildNodes()) {
			el.removeChild(el.lastChild);
		}
	}
		
	function publish(){
		var fName = imageCode;
		var tagStr="";
		var tags = document.getElementById("tagswnd").getElementsByClassName("tag");
		var str = document.forms["fAddMedia"]["filename"].value.toLowerCase();
		if(!str.endsWith("png") &&
				!str.endsWith("jpg") &&
					!str.endsWith("bmp")){
			alert("No image to publish");
			document.forms["fAddMedia"]["filename"].value = "";
			document.getElementById("inputImage").setAttribute("src", "");
			return;
		}
		for(var i=0; i < tags.length; i++){
			tagStr += tags[i].childNodes[0].nodeValue;
			tagStr += ", ";
		}
		if(tagStr.length === 0){
			alert("Please, fill all tags field");
			return;
		}
		var descr = document.forms["fAddMedia"]["descr"].value;
		if(descr.length === 0){
			alert("Please, fill the description field");
			return;
		}
		var curr = currentUser;
		img = {
			"user": curr,
			"file": fName,
			"tags":tagStr,
			"descr":descr
		};
		imagesArray.push(img);
		document.getElementById("winadd").style.visibility = "hidden";
		var div = createImage(img.file, img.tags);
		document.getElementById("imgContainer").insertBefore(div, document.getElementById("addimage").nextSibling);
	}
	
	function loadUserData(){
		for( var i=0; i < imagesArray.length; i++){
			if(imagesArray[i].user !== currentUser)
				continue;
			var div = createImage(imagesArray[i].file, imagesArray[i].tags);
			document.getElementById("imgContainer").insertBefore(div, document.getElementById("addimage").nextSibling);
		}
	}
	
	var tag_name = new String;
	function fillContainer(){
		var imgs = document.getElementById("mockdata").getElementsByTagName("img");
		var div;
		for(var i=0; i < imgs.length; i++){
			div = createImage(imgs[i].getAttribute("src"), imgs[i].getAttribute("alt"));
			document.getElementById("imgContainer").appendChild(div);
		}
	}
	
	function createImage(src, alt){
		var img, a, div;
		img = document.createElement("img");
		img.setAttribute("src", src);
		a = document.createElement("a");
		a.appendChild(img);
		div = document.createElement("div");
		div.classList.add("image");
		div.setAttribute("tag", alt);
		div.appendChild(a);
		return div;
	}
	
	function chooseByTag(val){
		if(val !== tag_name)
			tag_name = (val === undefined || val === null) ? document.forms["search"]["string"].value : val.innerHTML;
		var imgs = document.getElementById("imgContainer").getElementsByClassName("image");
		for(var i=1; i < imgs.length; i++){
			var tt = imgs[i].getAttribute("tag").toLowerCase();
			if(tt.indexOf(tag_name.toLowerCase()) === -1)
				imgs[i].style.display = "none";
			else
				imgs[i].style.display = "block";
		}
		document.forms["search"]["string"].value = "";
	}

	function allowDrop(ev){
		ev.preventDefault();
	}
	
	function drop(ev){
		ev.preventDefault();
		var ff = ev.dataTransfer.files[0];
		insertImage(ff);
	}

	function insertImage(ff){
		var img = document.getElementById("inputImage");
		var reader = new FileReader();
		reader.onloadend = function(){
			img.src = reader.result;
			imageCode = reader.result;
		}
		if(ff){
			reader.readAsDataURL(ff);
		}
		document.forms["fAddMedia"]["filename"].value = ff.name;
	}
	
	function inputFile(){
		var ff = document.getElementById("input").files[0];
		insertImage(ff);
	}
	
//for del tags	
	var els = document.getElementsByClassName("del");
	for(var i=0; i < els.length; i++){
		els[i].addEventListener("click", function(){document.getElementById("tagswnd").removeChild(this.parentElement);});
	}
	
	function addTag(){
		var t = document.forms["fAddMedia"]["tagTxt"].value;
		if(t.length === 0){
			alert("Tag with null name can not be added");
			return;
		}
		var txt = document.createTextNode(t);
		var elem = document.createElement("div");
		var img = document.createElement("img");
		img.src = "img/del_tag.png";
		img.setAttribute("width", "auto");
		img.setAttribute("height", "auto");
		img.classList.add("del");
		img.addEventListener("click", function(){document.getElementById("tagswnd").removeChild(img.parentElement);});
		elem.appendChild(txt);
		elem.appendChild(img);
		elem.classList.add("tag");
		document.getElementById("tagswnd").appendChild(elem);
		document.forms["fAddMedia"]["tagTxt"].value = "";
	}
