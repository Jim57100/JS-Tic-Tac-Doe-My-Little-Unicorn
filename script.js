window.addEventListener("load", () => {
  console.log("program ready !");
  window.morpion = new Morpion();
  $(".target").tilt({
    speed: 1000,
    scale: 1.2
  });
});


class Morpion {
  constructor() {

    //selectors
    this.inputP1 = document.getElementById('p1Name');
    this.inputP2 = document.getElementById('p2Name');
    this.unicorns = document.querySelectorAll('.unicorns_p1');
    this.characterTab = [];
    this.startBtn = document.querySelector('.startBtn');
    this.startPage = document.getElementById('startPage');
    this.gamePage = document.getElementById('gamePage');

    this.statut = document.querySelector('h2');
    this.cell = document.querySelectorAll('.cell');
    this.clearBtn = document.querySelector('.clear');

    this.scoreName1 = document.querySelector('#scoreName1');
    this.scoreName2 = document.querySelector('#scoreName2');
    this.scoreP1 = document.getElementById('scoreP1');
    this.scoreP2 = document.getElementById('scoreP2');
    this.p1Img = document.getElementById('p1Img');
    this.p2Img = document.getElementById('p2Img');


    //on set le jeu à 0
    this.etatJeu = ["", "", "", "", "", "", "", "", ""];

    //on défini le premier joueur  
    this.jeuActif = true;
    this.joueurActif = "X";
    this.couleurP1 = 'blue';
    this.couleurP2 = 'orange';

    //Jeux gagnants
    this.winTable = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];


    /********** Appeler les méthodes **********/
    //Selectionner les personnages
    for (let i = 0; i < this.unicorns.length; i++) {
      this.unicorns[i].addEventListener('click', () => {
        this.unicornSelect(i);
      });
    }

    //Lancer le jeu
    this.startBtn.addEventListener('click', () => {
      if (this.inputP1.value != '' && this.inputP2.value != '' && this.characterTab.length == 2) {
        this.startGame();
      } else {
        window.alert('Names and unicorns needed !')
      }
    });

    // Activer les cases
    for (let i = 0; i < this.cell.length; i++) {
      this.cell[i].addEventListener('click', (e) => {
        this.gestionClic(i);
      });
    };

    //Effacer les cases
    this.clearBtn.addEventListener('click', () => {
      this.clearGrid();
    })

  }

  /****************** ACCUEIL ******************/

  unicornSelect(i) {
    console.log(i);
    if (this.characterTab.length == 0) {
      //Joueur 1 
      // on sélectionne la licorne
      this.unicorns[i].classList.add('selectP1');
      // on récupère la source de l'image
      let image1 = this.unicorns[i].querySelector('img');
      this.characterTab.push(image1.src);
      console.log(image1.src);

    } else if (this.characterTab.length == 1) {
      //Joueur 2
      //on change la couleur
      this.unicorns[i].classList.add('selectP2');
      // on récupère la source de l'image
      let image2 = this.unicorns[i].querySelector('img');
      this.characterTab.push(image2.src);
      console.log(image2.src);

    } else {
      window.alert('No more unicorns !!')
    }
  }

  startGame() {

    //Changer d'écran
    this.startPage.classList.add('hidden');
    this.gamePage.classList.remove('hidden');
    this.gamePage.classList.add('show'); // ????

    //Copier les noms dans le tableau des scores
    this.scoreName1.textContent = this.inputP1.value;
    console.log(this.inputP1.value);
    this.scoreName2.textContent = this.inputP2.value;
    console.log(this.inputP2.value);

    //Copier les images
    const img1 = document.createElement('img');
    img1.src = this.characterTab[0];
    this.p1Img.appendChild(img1);

    const img2 = document.createElement('img');
    img2.src = this.characterTab[1];
    this.p2Img.appendChild(img2);
  }

  /*************** MORPION ***************/
  gestionClic(i) {
    // Récupérer l'index de la case
    const indexCase = parseInt(this.cell[i].dataset.index);
    console.log(indexCase);

    //vérifier que la case est vide
    if (this.etatJeu[indexCase] !== '' || !this.jeuActif) {
      return //nothing
    } else {
      this.etatJeu[indexCase] = this.joueurActif
      console.log(this.etatJeu);
      this.cell[i].textContent = this.joueurActif;
      if (this.joueurActif == "X") {
        this.cell[i].classList.add('colorP1');
      } else {
        this.cell[i].classList.add('colorP2');
      }
    }
    this.verifgagne();
  }

  clearGrid() {
    this.joueurActif = "X";
    this.jeuActif = true;
    this.etatJeu = ["", "", "", "", "", "", "", "", ""];
    this.statut.innerHTML = '';
    document.querySelectorAll(".cell").forEach((cell) => cell.textContent = "");
    for (let i = 0; i < this.cell.length; i++) {
      this.cell[i].classList.remove('colorP1', 'colorP2');
    };
    //masquer le bouton reset

  }

  verifgagne() {
    let tourGagnant = false; // On part du principe que les conditions de victoires ne sont pas remplies
    for (let conditionVictoire of this.winTable) {
      let val1 = this.etatJeu[conditionVictoire[0]]
      let val2 = this.etatJeu[conditionVictoire[1]]
      let val3 = this.etatJeu[conditionVictoire[2]]

      // Si l'une des cases est vide
      if (val1 === "" || val2 === "" || val3 === "") {
        continue
      }

      // Si les 3 cases sont identiques
      if (val1 === val2 && val2 === val3) {
        tourGagnant = true // on gagne
        break
      }
    }

    // Si on a gagné
    if (tourGagnant) {
      //Incrémenter le score du joueur de 1
      if (this.joueurActif == 'X') {
        this.scoreP1.textContent++;
      } else {
        this.scoreP2.textContent++;
      }
      //Afficher le message
      if (this.joueurActif == 'X') {
        this.statut.innerHTML = `${this.scoreName1.textContent} a gagné !`;
      } else {
        this.statut.innerHTML = `${this.scoreName2.textContent} a gagné !`;
      }
      this.jeuActif = false;
      //Afficher le bouton reset

      return
    }

    // Si toutes les cases sont remplies sans conditions de victoire
    if (!this.etatJeu.includes("")) {
      this.statut.innerHTML = `Round Draw !`;
      this.jeuActif = false;
      //Afficher le bouton reset

      return
    }

    // On change de joueur
    this.joueurActif = (this.joueurActif === "X" ? "O" : "X");
    if (this.joueurActif == 'X') {
      this.statut.innerHTML = `C'est au tour de ${this.scoreName1.textContent}`;
    } else {
      this.statut.innerHTML = `C'est au tour de ${this.scoreName2.textContent}`;
    }
  }

}