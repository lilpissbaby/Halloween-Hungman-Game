

/* Estructura "constant" del joc */
window.onload = carregarCompletament();

var gameConfig = {
    liveLook: ["monster5.png", "monster4.png", "monster3.png", "monster2.png", "monster1.png", "monster0.png"],
    wordsToGuess: ["elefant", "criatura", "llapis", "maduixa"],
    numberOfLives: 5
}

var paraulaPerEsbrinar = gameConfig.wordsToGuess[Math.floor(Math.random() * 4)];

// Guardem un array amb la "forma" de la paraula, això és, guions on hi ha d'haver una lletra
// i a mesura que anem esbrinant la paraula, hi posem les lletres
var lletresUbicades = [];

/* Estructura per tenir controlat en tot moment l'estat del joc */
var gameStatus = {
    status: "playing",
    lives: gameConfig.numberOfLives,
    wordToGuess: "",
    wordCompleted: "",
}

/**  funció encarregada de carregar elements del dom amb els quals es farà interacció,
 com els botons de pista i de nova partida, degut que el JS es crida abans de carregar
 res del body
*/
function carregarCompletament(){
    document.addEventListener("DOMContentLoaded", function() {
        
        // declarem i assignem escoltes d'event als botons de nova partida i pista, respectivament
        new_game = document.getElementById("new_game");    
        new_game.onclick = function() {
            location.reload();
        }

        clue = document.getElementById("clue");  
        clue.addEventListener("mouseover", function(){ mostrarPista(this)}, false);  
        clue.addEventListener("mouseout", function (){ reiniciarPista(this)}, false);
    
        // modificació de l'espai de lletres per cada paraula
        espaiLletres = document.getElementById("letters");
        longitudParaula = paraulaPerEsbrinar.length;

        for(i = 0; i < longitudParaula; i++){
            lletresUbicades.push("_");
        }

        espaiLletres.innerHTML = lletresUbicades.join(''); // join('') ajuntarà cada casella sobre l'array separa, en aquest cas, per espais buits. Una mena de toString més còmode
        carregarMissatge("welcome");        
    });

    document.getElementsByTagName("html")[0].addEventListener("keyup", function(){ escriureLletra(event)}, false);
}

/** Funció que mostrarà per pantalla qualsevol misssatge dels guardats a l'HTML,
 *  passant per paràmetre el id del missatge en qüestió.
 * 
 * @param {*} tipusMissatge 
 */
function carregarMissatge(tipusMissatge){
    console.log(paraulaPerEsbrinar);
    
    // recollim el contenidor del missatge sencer i el seu botó
    // carreguem per paràmetre el tipus de missatge, per reutilitzar així la funció
    infoMissatge = document.getElementsByClassName("info")[0];
    botoOut = document.getElementById("btn_ok");
    spanMissatge = document.getElementById(tipusMissatge);
    missatges = document.getElementsByClassName("info_msg");

   
    // juguem amb la classe .info_msg, que conté la propietat display: none.
    // en obrir el navegador, la treiem per mostrar-lo, en clicar "Continuar", l'apliquem
    // de nou per amagar el missatge
    infoMissatge.style.display = "block";
    
    spanMissatge.classList.remove("info_msg");

    botoOut.onclick = function() {
        infoMissatge.style.display = "none";
    }
}

/** En escoltar un polsament de LLETRES en el teclat, s'escriuràn on es desitji.f
 * 
 */
function mostrarPista(element){
    // partir la paraula segons les lletres i tria una a l'atzar
    paraulaPerEsbrinarArray = paraulaPerEsbrinar.split('');
    
    // compararem les lletres que ja tenim amb la paraula sencera, buscant les posicions buides (amb "_"). guardem aquestes
    // posicions, doncs haurem de suggerir les paraules en aquells espais, on l'usuari encara no ha posat una lletra
    posicionsRestants = [];

    for (i = 0; i < paraulaPerEsbrinarArray.length; i++) {
        if(paraulaPerEsbrinarArray[i] != lletresUbicades[i]){
            posicionsRestants.push(i);
        }
    }

    posArrayValorsRestants = posicionsRestants[Math.floor(Math.random() * posicionsRestants.length)];
    
    element.innerHTML = paraulaPerEsbrinarArray[posArrayValorsRestants];
    gameConfig.numberOfLives--;

    espaiVides = document.getElementById("lives");
    espaiVides.innerHTML = gameConfig.numberOfLives + " LIVES LEFT"
   
}

function canviarSprite(){
    fotoMonstre = document.getElementById("monster");
    switch (gameConfig.numberOfLives) {
        case 5:
            fotoMonstre.src = "img/monster0.png";
            break;
        case 4:
            fotoMonstre.src = "img/monster1.png";
            break;
        case 3:
            fotoMonstre.src = "img/monster2.png";            
            break;
        case 2:
            fotoMonstre.src = "img/monster3.png";
            break;
        case 1:
            fotoMonstre.src = "img/monster4.png";
            break;
        default:
            fotoMonstre.src = "img/monster5.png";
            break;
    }
}

/** Reiniciarà el ? a la casella de pistes
 * 
 * @param {*} element 
 */
function reiniciarPista(element){
    element.innerHTML = "?";
    canviarSprite();
    console.log(document.getElementById("monster"));
}

function escriureLletra(){
	
	lletres = "qwertyuiopasdfghjklçzxcvbnm";
	
	if(isNaN(event.key) && lletres.search(event.key) != -1 && event.key != '.'){
        evaluarParaula(event.key);
	}
}

/** Donada una lletra que s'ecoltarà com event de teclat, es revisarà si apareix en
 *  la paraula a esbrinar. Segons si aparegui o no, el resultat serà diferent.
 * 
 * @param {*} lletraInput 
 */
function evaluarParaula(lletraInput) {
    let paraulaCompleta = true; 

    if (paraulaPerEsbrinar.includes(lletraInput)) { // si la lletra està a la paraula...
        for (let i = 0; i < lletresUbicades.length; i++) {
            if (lletraInput === paraulaPerEsbrinar[i]) {
                lletresUbicades[i] = lletraInput; // s'afegeix a l'array resultant
            }
        }

        document.getElementById("letters").innerHTML = lletresUbicades.join('');

        // Verificar si s'ha completat la paraula
        for (let i = 0; i < lletresUbicades.length; i++) {
            if (lletresUbicades[i] === "_") {
                paraulaCompleta = false;
                break;
            }
        }

        if (paraulaCompleta) {
            carregarMissatge("game_success");
        }
    } else { // Si la lletra no està en la paraula...
        gameConfig.numberOfLives--;
        canviarSprite();
        document.getElementById("lives").innerHTML = gameConfig.numberOfLives + " LIVES LEFT";

        if (gameConfig.numberOfLives <= 0) {
            carregarMissatge("game_fail"); 
        }
    }
}