/*
	"Dictionnaire" qui va contenir tout le "scénario", une ligne par trial.
	La structure est {nom_de_colonne_1: [une valeur par trial], nom_de_colonne_2: [une valeur par trial], etc.}
*/
const Trials = [];

/* Liste des noms de colonnes dans le bon ordre, au cas où le "dictionnaire" ne respecte pas l'ordre. */
let ParamNamesInOrder = [];
const PARTICIPANT_INDEX = 0;
const TECHNIQUE_INDEX = 1;
const DISTANCE_INDEX = 2;
const TAILLE_INDEX = 3;
const DENSITE_INDEX = 4;
const DIRECTION_INDEX = 5;
const BLOCK_INDEX = 6;
const TRIAL_INDEX = 7;

let currentTrial = null;
let dateAtStart = null;

const ACTIVATE_BUBBLE_WITHOUT_MOUSE_MOVE = false;

/* Fonction utilitaire permettant d'obtenir toutes les valeurs uniques dans une liste. */
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

/*
	Lecture d'un fichier de scénario.
	Le fichier de scénario doit être au format .tsv (tab-separated values) et commencer par une ligne
	décrivant les noms de colonnes.
	Le fichier est chargé en cliquant sur un bouton en haut de la page.
*/
function lireScenario(event) {

  const input = event.target;
  const reader = new FileReader();

  reader.onload = function() {
    const text = reader.result.split('\n');

    // First line: Parameter names

    ParamNamesInOrder = text[0].split('\t');
    for (let i = 0 ; i < ParamNamesInOrder.length ; i++) {
      Trials[ ParamNamesInOrder[i] ] = [];
    }


    // Next lines: Trials

    for (let i = 1 ; i < text.length ; i++) {
      const paramValues = text[i].split('\t');
      for (let j = 0 ; j < paramValues.length ; j++) {
        Trials[ ParamNamesInOrder[j] ][i] = paramValues[j];
      }
    }

    const uniqueParticipants = Trials['Participant'].filter( onlyUnique );

    const select = document.getElementById('Plist');
    for (let i = 0 ; i < uniqueParticipants.length ; i++) {
      const opt = document.createElement('option');
      opt.value = uniqueParticipants[i];
      opt.innerHTML = uniqueParticipants[i];
      select.appendChild(opt);
    }

    // Voir logging.js
    initLogs();

  };

  reader.readAsText(input.files[0]);

}


function chargerParticipant(participantToLoad) {
  /* DONE
      - charger le premier trial du participant correspondant
  */
  let firstTrialIndex = -1;
  for (let i = 0; i < Trials[ParamNamesInOrder[PARTICIPANT_INDEX]].length; i++)
    if (Trials[ParamNamesInOrder[PARTICIPANT_INDEX]][i] === participantToLoad &&
        Trials[ParamNamesInOrder[BLOCK_INDEX]][i] === "0" && Trials[ParamNamesInOrder[TRIAL_INDEX]][i] === "0")
    {
      firstTrialIndex = i;
      break;
    }

  if (firstTrialIndex < 0)
  {
    alert("No trial was find for " + participantToLoad);
    clearCanvas();
    currentTrial = null;
    drawSandbox();
    return;
  }

  alert("TODO chargerParticipant( " + participantToLoad + " )");
  if (CurrentSelection !== null)
  {
    CurrentSelection.svg.fire('mouseout');
    CurrentSelection = null;
  }

  currentTrial = {
    Participant: participantToLoad,
    Technique: Trials[ParamNamesInOrder[TECHNIQUE_INDEX]][firstTrialIndex],
    Distance: Trials[ParamNamesInOrder[DISTANCE_INDEX]][firstTrialIndex],
    Taille: Trials[ParamNamesInOrder[TAILLE_INDEX]][firstTrialIndex],
    Densite: Trials[ParamNamesInOrder[DENSITE_INDEX]][firstTrialIndex],
    Direction: Trials[ParamNamesInOrder[DIRECTION_INDEX]][firstTrialIndex],
    Block: Trials[ParamNamesInOrder[BLOCK_INDEX]][firstTrialIndex],
    Trial: Trials[ParamNamesInOrder[TRIAL_INDEX]][firstTrialIndex],
    X: canvas.node.width.baseVal.value / 2 - (Trials[ParamNamesInOrder[TAILLE_INDEX]][firstTrialIndex]),
    Y: canvas.node.height.baseVal.value / 2
  };

  if (currentTrial.Direction === "Droite")
    currentTrial.X += currentTrial.Distance * mm2pixel;
  else
    currentTrial.X -= currentTrial.Distance * mm2pixel;

  dateAtStart = new Date();
  logEvent({
    EventType: "Start"
  });

  Bubble = currentTrial.Technique === "BubbleCursor";
  if (cursorFeedBack !== null)
    cursorFeedBack.radius(0);

  drawScene();
}

function trialSuivant() {
  /* DONE fonction à appeler pour passer au trial suivant.
      - Logguer les résultats
      - Vérifier qu'il ne s'agit pas du dernier trial pour ce participant
      - Nettoyer le canvas
      - Générer un nouveau canvas à partir des paramètres du trial
  */
  if (!Trials || !Trials[ParamNamesInOrder[PARTICIPANT_INDEX]] || !currentTrial)
    return;

  let trialIndex = -1;
  let i;
  const trialsLength = Trials[ParamNamesInOrder[PARTICIPANT_INDEX]].length;
  for (i = 0; i < trialsLength; i++)
    if (Trials[ParamNamesInOrder[PARTICIPANT_INDEX]][i] === currentTrial.Participant &&
        Trials[ParamNamesInOrder[BLOCK_INDEX]][i] === currentTrial.Block &&
        parseInt(Trials[ParamNamesInOrder[TRIAL_INDEX]][i], 10) === parseInt(currentTrial.Trial, 10)+1)
    {
      trialIndex = i;
      break;
    }

  if (trialIndex < 0)
    for (i = 0; i < trialsLength; i++)
      if (Trials[ParamNamesInOrder[PARTICIPANT_INDEX]][i] === currentTrial.Participant &&
          parseInt(Trials[ParamNamesInOrder[BLOCK_INDEX]][i], 10) === parseInt(currentTrial.Block, 10)+1 &&
          Trials[ParamNamesInOrder[TRIAL_INDEX]][i] === "0")
      {
        trialIndex = i;
        break;
      }

  if (trialIndex < 0)
  {
    alert("Experimentation terminée\n\nVotre code participant est le : " + currentTrial.Participant);
    logEvent({
      EventType: "End"
    });
    currentTrial = null;
    drawSandbox();
    return;
  }

  currentTrial.Technique  = Trials[ParamNamesInOrder[TECHNIQUE_INDEX]][trialIndex];
  currentTrial.Distance   = Trials[ParamNamesInOrder[DISTANCE_INDEX]][trialIndex];
  currentTrial.Taille     = Trials[ParamNamesInOrder[TAILLE_INDEX]][trialIndex];
  currentTrial.Densite    = Trials[ParamNamesInOrder[DENSITE_INDEX]][trialIndex];
  currentTrial.Direction  = Trials[ParamNamesInOrder[DIRECTION_INDEX]][trialIndex];
  currentTrial.Block      = Trials[ParamNamesInOrder[BLOCK_INDEX]][trialIndex];
  currentTrial.Trial      = Trials[ParamNamesInOrder[TRIAL_INDEX]][trialIndex];

  if (currentTrial.Direction === "Droite")
    currentTrial.X += currentTrial.Distance * mm2pixel;
  else
    currentTrial.X -= currentTrial.Distance * mm2pixel;

  Bubble = currentTrial.Technique === "BubbleCursor";
  if (cursorFeedBack !== null)
    cursorFeedBack.radius(0);

  if (CurrentSelection !== null)
  {
    CurrentSelection.svg.fire('mouseout');
    CurrentSelection = null;
  }

  logEvent({
    EventType: "NextTrial"
  });
  dateAtStart = new Date();
  drawScene();

  if (Bubble && ACTIVATE_BUBBLE_WITHOUT_MOUSE_MOVE)
    canvas.fire('mousemove');
}
