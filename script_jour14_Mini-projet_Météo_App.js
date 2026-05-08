// 🔑 Ta clé API (remplace par la tienne !)
const CLE_API = "b71a19f6ccc218d168db2d6c87b27120";

// 🎯 Sélection des éléments du DOM
const champVille = document.querySelector("#champVille");
const btnRechercher = document.querySelector("#btnRechercher");
const resultat = document.querySelector("#resultat");
const messageErreur = document.querySelector("#message-erreur");
const chargement = document.querySelector("#chargement");
const listeHistorique = document.querySelector("#listeHistorique");

// 📦 Historique sauvegardé dans LocalStorage
// (tableau des 5 dernières villes recherchées)
let historique = [];

// --------------------------------------------------------
// 🔧 FONCTIONS À COMPLÉTER PAR TOI-MÊME (voir ci-dessous)
// --------------------------------------------------------


//Tâche 1:
document.addEventListener("DOMContentLoaded",()=>{
    const tab = localStorage.getItem("historique");
    historique = (tab===null)?[]:JSON.parse(tab);

//Tâche 5:
    afficherHistorique();
    btnRechercher.addEventListener("click", () => {
    rechercherMeteo(champVille.value);
});
 champVille.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            rechercherMeteo(champVille.value);
        }
});

})

//Tâche 2:
function afficherHistorique(){
    listeHistorique.innerHTML="";

    historique.forEach(ville=>{
       const boutton =  document.createElement("button");
       boutton.textContent = ville;
       boutton.className = "btn-historique";
       boutton.addEventListener("click",()=>{
         rechercherMeteo(ville);    
       })
       listeHistorique.append(boutton);
    })
}

//Tâche 3:
function sauvegarderVille(ville){
    if(!historique.includes(ville)){
        historique.unshift(ville);
        historique = historique.slice(0,5);
        localStorage.setItem("historique",JSON.stringify(historique));
        afficherHistorique();
    }}

//Tâche 4:
async function  rechercherMeteo(ville){
   
        if (ville.trim()==="") messageErreur.innerHTML="le champs est vide!";
        else{
        messageErreur.innerHTML="";
         chargement.innerHTML="⏳ Chargement...";
         try { const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ville}&appid=${CLE_API}&units=metric&lang=fr`);
         if (!res.ok) { 
             chargement.innerHTML = "";
             messageErreur.innerHTML=`Il y a l'erreur de: ${res.status}`;
             console.log(res.status);
         } else {
            const data= await res.json();
            resultat.innerHTML = "";
            const div = document.createElement("div");
            div.className="meteo-carte";

            const divV = document.createElement("div");
            divV.className="meteo-ville";
            divV.innerHTML=data.name+", "+data.sys.country;
            div.append(divV);

            const divT = document.createElement("div");
            divT.className="meteo-temp";
            divT.innerHTML=data.main.temp;
            div.append(divT);

            const divD = document.createElement("div");
            divD.className="meteo-desc";
            divD.innerHTML=data.weather[0].description;
            div.append(divD);

            const divDetails = document.createElement("div");
            divDetails.className="meteo-details";
            const spanU = document.createElement("span");
            spanU.textContent=`💧 Humidité :${data.main.humidity} %`;
            divDetails.append(spanU);
            const spanV = document.createElement("span");
            spanV.textContent=`💨 Vent : ${data.wind.speed} km/h`;
            divDetails.append(spanV);
            const spanR = document.createElement("span");
            spanR.textContent=`👁️ Ressenti : ${data.main.feels_like} °C`;
            divDetails.append(spanR);
            div.append(divDetails);
            resultat.append(div);

            sauvegarderVille(ville.trim());
            chargement.innerHTML = "";
         } 
   } catch (error) {
        messageErreur.textContent=`❌ Erreur réseau ${ error.message}`;
        console.log("L'erreur est : "+error);  
    }}
}


