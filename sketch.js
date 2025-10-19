let table;

function preload() {
  table = loadTable("assets/dataset.csv", "csv", "header");
}

function setup() {
  //aggiungo un'altezza per l'inserimento del titolo
  let titleHeight = 105;
  //sommo conteggiando anche lo spazio occupato dal titolo
  let outerPadding = 20 + titleHeight;
  let padding = 45;
  let itemSize = 30;

  //calcolo il numero delle colonne arrotondando per difetto
  let cols = floor((windowWidth - outerPadding * 2) / (itemSize + padding));
  //calcolo il numero delle righe
  let rows = ceil(table.getRowCount() / cols);
  //calcolo l'altezza totale
  let totalHeight = outerPadding * 2 + rows * itemSize + (rows - 1) * padding;

  //creo il canvas
  createCanvas(windowWidth, totalHeight);
  background("lightblue");

  console.log("cols: ", cols, " rows: ", rows);

  let colCount = 0;
  let rowCount = 0;

   for (let rowNumber = 0; rowNumber < table.getRowCount(); rowNumber++) {
    //carico dati della riga
    let data = table.getRow(rowNumber).obj;

    // prendo valore per dimensione
    let myValue = data["column0"];

    //calcolo min e massimo
    let allValues = table.getColumn("column0");
    let minValue = min(allValues);
    let maxValue = max(allValues);
    /* si parla del valore che vogliamo scalare rispetto a 
    valore minimo, massimo, dimensioni più piccola e più grande */
    let scaledValue = map(myValue, minValue, maxValue, 1, itemSize);

    //seconda variabile per interpolare il colore
    let value2 = data["column2"];
    let allValues2 = table.getColumn("column2");
    let minValue2 = min(allValues2);
    let maxValue2 = max(allValues2);
    // trasformare i valori + min e max in un scala standard da 0 a 1
    let value2Mapped = map(value2, minValue2, maxValue2, 0, 1);

    //calcolo xPos e yPos
    let xPos = outerPadding + colCount * (itemSize + padding);
    let yPos = outerPadding + rowCount * (itemSize + padding);

    //FUNZIONE PER DISEGNARE LE PIASTRELLINE
    drawTile(xPos, yPos, itemSize, myValue, value2Mapped);

    //ad ogni ciclo colCount aumenta
    colCount++;

    //verifica se si è a fine riga
    if (colCount == cols) {
      colCount = 0;
      rowCount++;
    }
  }
}

function draw() {
  fill(0, 10, 150);
  noStroke();
  textStyle(BOLD);
  push();
  textSize(28);
  textFont('Segoe Script');
  textAlign(CENTER);
  text("Generazione di glifi", width / 2, 40);
  pop();
  textSize(20)
  textFont('Georgia');
  text("ASSIGNMENT 2", width / 2, 70)
}

//creazione di una funzione che generi la singola piastrella
function drawTile(xPos, yPos, itemSize, myValue, value2Mapped) {
  let c1 = color(198, 233, 249);
  let c2 = color(0, 0, 150);
  let mappedColor = lerpColor(c1, c2, value2Mapped);

  /* passaggio per disegnare il QUADRATO ESTERNO, basandosi su valori 
  MAGGIORI di 0 - quadrato normale! - e MINORI - quadrato ruotato!
  precede la piastrella base per evitare sovrapposizioni ad essa*/
  if (myValue > 0) {
    push();
    fill("white");
    stroke(0);
  /* sposta il quadratino a sx / dx (-10px) rispetto ad xPos ed yPos
  ed aggiunge 20px rispetto all'itemSize */ 
    rect(xPos - 10, yPos -10, itemSize + 20, itemSize + 20);
    pop();
  } else {
    push();
    translate(xPos + itemSize / 2, yPos + itemSize / 2);
    // ruota di 45 gradi le coordinate - ROTATE richiede in RADIANTI
    rotate(radians(45));
    rectMode(CENTER);
    fill("whitesmoke");
    rect(0, 0, itemSize + 20, itemSize + 20);
    pop();
  }

  // PIASTRELLINA PRINCIPALE - itemSize
  fill(mappedColor);
  strokeWeight(1);
  rect(xPos, yPos, itemSize);
  strokeWeight(1);
  stroke("black");

  /* passaggio per LINEA DIAGONALE 
  se il valore è divisibile per 3, va da SX verso DX
  - con coord + itemSize trovo il punto finale della linea */
  if (myValue % 3 === 0) {
    push();
    strokeWeight(1);
    line(xPos, yPos, xPos + itemSize, yPos + itemSize);
    pop();
  }

  /* passaggio per LINEA DIAGONALE 
  se il valore è divisibile per 5, va da DX verso SX
  - con coord + itemSize agli estremi */
  if (myValue % 5 === 0) {
    push();
    strokeWeight(1);
    line(xPos + itemSize, yPos, xPos, yPos + itemSize);
    pop();
  }
  
  /* passaggio per QUADRATINO INTERNO 
  se il valore è pari, allora il quadrato ottenuto sarà normale e bianco;
  in caso contrario sarà ruotato e giallo
  */
  if (myValue % 2 === 0) {
    fill("whitesmoke")
    rect(xPos + itemSize * 0.25, yPos + itemSize * 0.25, itemSize * 0.5, itemSize * 0.5);
  } else {
    push();
    translate(xPos + itemSize / 2, yPos + itemSize / 2);
    rotate(radians(45));
    rectMode(CENTER);
    fill("yellow");
    stroke(0.5);
    rect(0, 0, itemSize * 0.5, itemSize * 0.5);
    pop();
  }
}