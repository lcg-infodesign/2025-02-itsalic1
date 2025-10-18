let table;

function preload() {
  // put preload code here
  table = loadTable("assets/dataset.csv","csv","header");
}

function setup() {
  //controllo se ho caricato i dati

  let outerPadding = 20; 
  let padding = 10; 
  let itemSize = 30; 

  //calcolo il numero delle colonne
  let cols = floor((windowWidth - outerPadding * 2) / (itemSize + padding)); // arrotondo per difetto --> meglio una colonna in meno che una che sborda

  let rows = ceil(table.getRowCount() / cols); //numero di righe / il numero di colonne

  let totalHeight = outerPadding * 2 + rows * itemSize + (rows - 1) * padding;

  //creo il canvas
  createCanvas(windowWidth, totalHeight); //larghezza finestra, altezza calcolata

  background("coral");

  console.log("cols: ", cols, "rows: ", rows);

  let colCount = 0;
  let rowCount = 0;

  //esegue il ciclo per ogni riga
  for(let rowNumber = 0; rowNumber < table.getRowCount(); rowNumber++){
    //carico i dati dalla tabella
    let data = table.getRow(rowNumber).obj;
    
    //prendo valore per dimensione
    let myValue = data['column0'];

    //calcolo min e max della colonna
    let allValues = table.getColumn("column0");
    let minValue = min(allValues);
    let maxValue = max(allValues);
    let scaledValue = map(myValue, minValue, maxValue, 1, itemSize); //valore che vogliamo scalare, valore minimo della scala di partenza, valore max, dim. + piccola, dim. + grande 

    //seconda variabile per il colore
    let value2 = data["column2"];
    let allValues2 = table.getColumn("column2");
    let minValue2 = min(allValues2);
    let maxValue2 = max(allValues2);
    let value2Mapped = map(value2, minValue2, maxValue2, 0, 1);

    let c1 = color("lightblue");
    let c2 = color("blue");

    let mappedColor = lerpColor(c1, c2, value2Mapped);

    fill(mappedcolor)

    //posizione x e y
    let xPos = outerPadding + colCount * (itemSize + padding);
    let yPos = outerPadding + rowCount * (itemSize + padding);

    //rettangolo per ogni valore del dataset
    rect(xPos, yPos, scaledValue, scaledValue) // x, y, largh., altez.

    //ad ogni ciclo aumento numero colonne
    colCount++;

    //controllo se siamo a fine riga
    if(colCount == cols){ //se è uguale al numero di colonne
      colCount = 0; //conteggio colonne torna 0
      rowCount++; //conteggio righe aumenta di uno
    }
  }
}


function draw() {
  // put drawing code here
}
