
function darkMode() {
  var element = document.body;
  var iconeGit = document.getElementById("gitIcon");
  var bgpainel = document.getElementsByClassName("painel");
  element.classList.toggle("light-mode");

  if(document.getElementById("myonoffswitch").checked){

    iconeGit.style.filter = "invert(1)";
  }else{
    iconeGit.style.filter = "invert(0)";
  }

}