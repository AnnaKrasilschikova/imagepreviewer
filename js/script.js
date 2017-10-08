	function load(){
		fillContainer();
		var curr = localStorage.getItem("currentUser");
		if(curr === "undefined" || curr === null)
			return;
		var obj = JSON.parse(localStorage.getItem(curr));
			
		document.getElementById("greet").innerHTML = "Hi, " + obj.name + "!";
		document.getElementById("inout").setAttribute("src", "img/logout.png");
		document.getElementById("addimage").style.display = "block";
		loadUserData();

	}

//////Login
//			localStorage.setItem("John@mail.com", '{"name":"John", "passw":"123456"}');
//			localStorage.setItem("Mary@mail.com", '{"name":"Mary", "passw":"654321"}');
//			localStorage.setItem("David@mail.com", '{"name":"David", "passw":"qwerty"}');
			
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
		if(atpos < 1 || dotpos<atpos+2 || dotpos+2==x.length){
			return false;
		}
		return true;
	}
	function passwordIsValid(fName){
		var x = document.forms[fName]["pwd"].value;
		var vString = /^(?=.*[0-9])[a-zA-Z0-9]{6,}$/;
		if(!vString.test(x)){
			return false;
		}
		return true;
	}
/*			function checkSignIn(){
				if(!emailIsValid("fSignIn")){
					alert("not valid e-mail address");
					return false;
				}	
				if(!passwordIsValid("fSignIn")){
					alert("not valid password");
					return false;
				}
				return true;
			}
*/			
	function checkSignUp(){
		if(!userNameIsValid("fSignUp")){
			alert("not valid username");
			return false;
		}
		if(!emailIsValid("fSignUp")){
			alert("not valid email address");
			return false;
		}
		if(!passwordIsValid("fSignUp")){
			alert("not valid password");
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
		var strInsert = "'{\"name\":" + usr + ",\"passw:\"" + pwd + "\"}'";
		localStorage.setItem(mail, strInsert);
		localStorage.setItem("currentUser", mail);
		document.getElementById("AccessWnd").style.display = "none";
		document.getElementById("inout").setAttribute("src", "img/logout.png");
		document.getElementById("greet").innerHTML = "Hi, " + usr + "!";
		document.getElementById("addimage").style.display = "block";
	}
		
	function onLogin(){
		var usr = document.forms["fSignIn"]["email"].value;
		var obj = JSON.parse(localStorage.getItem(usr));
		if(obj === null){
			alert("Incorrect E-mail address");
			document.forms["fSignIn"]["email"].value = "";
			document.forms["fSignIn"]["pwd"].value = "";
		} else if(document.forms["fSignIn"]["pwd"].value !== obj.passw){
			alert("incorrect password");
			document.forms["fSignIn"]["pwd"].value = "";
		}else{
			document.getElementById("greet").innerHTML = "Hi, " + obj.name + "!";
			localStorage.setItem("currentUser", usr);
			document.getElementById("AccessWnd").style.display = "none";
			document.getElementById("inout").setAttribute("src", "img/logout.png");
			document.getElementById("addimage").style.display = "block";
		}
		loadUserData();
	}
		
	function access(){
		if(document.getElementById("inout").getAttributeNode("src").value === "img/logout.png"){
			localStorage.setItem("currentUser", "undefined");
			document.getElementById("greet").innerHTML = "";
			document.getElementById("inout").setAttribute("src", "img/login.png");
			document.getElementById("addimage").style.display = "none";
			var el = document.getElementById("imgContainer");
			var ss = el.getElementsByClassName("image").length;
			console.log(ss);
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
		
/////////////////
	function clearImage(){

		document.getElementById("inputImage").setAttribute("src", "");
		document.forms["fAddMedia"]["filename"].value = "";
		document.forms["fAddMedia"]["descr"].value = "";
		var el = document.getElementById("tagswnd");
		while (el.hasChildNodes()) {
			el.removeChild(el.lastChild);
		}
		
	}
		
	function publish(){
		var fName = imageCode;//document.forms["fAddMedia"]["filename"].value;
		var tagStr="";
		var tags = document.getElementById("tagswnd").getElementsByClassName("tag");
		for(var i=0; i < tags.length; i++){
			tagStr += tags[i].childNodes[0].nodeValue;
			tagStr += ", ";
		}
		if(tagStr.length === 0){
			alert("Please, fill all tags field");
			
		}
		var descr = document.forms["fAddMedia"]["descr"].value;
		if(descr.length === 0){
			alert("Please, fill the description field");
		}
		var curr = localStorage.getItem("currentUser");
		var store = {
			"user": curr,
			"file": fName,
			"tags":tagStr,
			"descr":descr
		};
		var tmp = [];
		if( localStorage.getItem("images") !== null){
			tmp = JSON.parse(localStorage.getItem("images"));
			console.log(tmp.length);
		}
		tmp.push(store);
		localStorage.setItem("images", JSON.stringify(tmp));
		
		document.getElementById("winadd").style.visibility = "hidden";
	}
	
	function loadUserData(){
		var temp = localStorage.getItem("images");
		if(temp === null)
			return;
	
		var data = JSON.parse(temp);
		var curr = localStorage.getItem("currentUser");
		var div;
		console.log(data.length);
		for(var i=0; i < data.length; i++){
			console.log(data[i].user);
			if(data[i].user !== curr)
				continue;
			div = createImage(data[i].file, data[i].tags);
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
		console.log(val);
		if(val !== tag_name)
			tag_name = (val === undefined || val === null) ? document.forms["search"]["string"].value : val.innerHTML;
		console.log(tag_name);
		var imgs = document.getElementById("imgContainer").getElementsByClassName("image");
		for(var i=1; i < imgs.length; i++){
			var tt = imgs[i].getAttribute("tag").toLowerCase();
			if(tt.indexOf(tag_name.toLowerCase()) === -1)
				imgs[i].style.display = "none";
			else
				imgs[i].style.display = "block";
		}
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
		console.log(img.src);
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
		var txt = document.createTextNode(t);
		var elem = document.createElement("div");
		var img = document.createElement("img");
		img.src = "img/del_tag.png";
		img.classList.add("del");
		img.addEventListener("click", function(){document.getElementById("tagswnd").removeChild(img.parentElement);});
		elem.appendChild(txt);
		elem.appendChild(img);
		elem.classList.add("tag");
		document.getElementById("tagswnd").appendChild(elem);
		document.forms["fAddMedia"]["tagTxt"].value = "";
	}
			