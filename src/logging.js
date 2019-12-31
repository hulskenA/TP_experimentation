

/* Une ligne par trial + noms de colonnes */
const Resultats = [];

/* Une ligne par mouse event + noms de colonnes */
const Cinematiques = [];


/*
	Initialisation des logs, notamment les noms de colonne (y compris les mesures).
*/
function initLogs() {

	Resultats.push( ParamNamesInOrder.join('\t') );
	Cinematiques.push( ParamNamesInOrder.join('\t') );

	/* DONE colonnes supplémentaires (mesures, etc.) */
	Resultats[0] += "\tTimeSinceTrialBeginning\tdistanceBetweenTargetAndClick\tClickOnTarget\n";
	Cinematiques[0] += "\tTimestamp\tEventType\tXMousePosition\tYMousePosition\tXTargetPosition\tYTargetPosition\n";
}

function logEvent(values) {
	/* DONE Ajouter un événement aux logs cinématiques. Tous les champs doivent être remplis. */
	if (!currentTrial)
		return;
	Cinematiques.push(currentTrial.Participant + "\t" + currentTrial.Technique + "\t" + currentTrial.Distance + "\t"
		+ currentTrial.Taille + "\t" + currentTrial.Densite + "\t" + currentTrial.Direction + "\t" + currentTrial.Block
		+ "\t" + currentTrial.Trial + "\t" + Date.now() + "\t" + values.EventType + "\t" + CurrentX + "\t" + CurrentY
		+ "\t" + currentTrial.X + "\t" + currentTrial.Y + "\n");
}

function logTrial(values) {

	/* DONE Ajouter un trial aux logs principaux. Tous les champs doivent être remplis. */
	Resultats.push(currentTrial.Participant + "\t" + currentTrial.Technique + "\t" + currentTrial.Distance + "\t"
		+ currentTrial.Taille + "\t" + currentTrial.Densite + "\t" + currentTrial.Direction + "\t" + currentTrial.Block
		+ "\t" + currentTrial.Trial + "\t" + (Date.now() - dateAtStart) + "\t"
		+ math.distance( [CurrentX, CurrentY], [currentTrial.X, currentTrial.Y] ) * pixel2mm
		+ "\t" + values.ClickOnTarget + "\n");

}
