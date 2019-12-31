// Typiquement, au moment de changer de trial.
function clearCanvas() {
    for (let i = 0 ; i < CurrentTargets.length ; i++) {
        CurrentTargets[i].svg.remove();
    }
    CurrentTargets = [];
}

function drawSandbox() {
    clearCanvas();
    Bubble = true;
    new Target( 100, 100, 55 * pixel2mm, true );
    new Target( 100, 200, 50 * pixel2mm, true );
    new Target( 300, 200, 60 * pixel2mm, true );
    new Target( 300, 400, 40 * pixel2mm, false );
    new Target( 500, 400, 30 * pixel2mm, true );
}

function drawScene() {
    clearCanvas();
    const maxDist = (mm2pixel * 100 + mm2pixel * currentTrial.Taille) / 2;
    const separatorDist = mm2pixel * currentTrial.Taille * (1 + currentTrial.Densite*1);
    const coordsIndex = {
        X: 0,
        Y: 0
    };

    let dist = 1;
    while (dist * separatorDist <= maxDist)
    {
        coordsIndex.X = dist;
        coordsIndex.Y = dist;

        for (let i = 0; i < 8 * dist; i++) {
            new Target(currentTrial.X + coordsIndex.X * separatorDist, currentTrial.Y + coordsIndex.Y * separatorDist,
                currentTrial.Taille, true);

            if (i < 2 * dist)
                coordsIndex.X--;
            else if (i < 4 * dist)
                coordsIndex.Y--;
            else if (i < 6 * dist)
                coordsIndex.X++;
            else
                coordsIndex.Y++;
        }
        dist++;
    }
    new Target(currentTrial.X , currentTrial.Y, currentTrial.Taille, false);
}