const table = document.getElementById('dynamic-table');
const addCriteriaBtn = document.getElementById('add-criteria');
const addAlternativeBtn = document.getElementById('add-alternative');
const removeCriteriaBtn = document.getElementById('remove-criteria');
const removeAlternativeBtn = document.getElementById('remove-alternative');
const computeBtn = document.getElementById('compute');
const openManualBtn = document.getElementById('manualBtn');
const closeManualBtn = document.getElementById('close-manual');
const popup = document.getElementById('popup');
const overlay = document.getElementById('overlay');
const resultTab = document.getElementById('result-tab');

function sumArray(_array, _index)
{
  if(_index===_array.length)
    {
      return 0;
    }  

  return _array[_index] + sumArray(_array,_index+1);
}

function checkNullElementInArray(_array, _index)
{
  if(_index===_array.length)
  {
    return true;
  }

  if(isNaN(_array[_index]))
  {
    return false;
  }

  return checkNullElementInArray(_array,_index+1);
}

function checkNullElementInMatrix(_matrix,_row)
{
  if(_row===_matrix.length)
  {
    return true;
  }

  if(!checkNullElementInArray(_matrix[_row],0))
  {
    return false;
  }

  return checkNullElementInMatrix(_matrix,_row+1);
}

//#region Create New Table
function createTableForMatrix(matrix,weights,maximize,tableName)
{
  rowNumber = matrix.length;
  columnNumber = matrix[0].length;
  const matrixTable = document.getElementById(tableName);

  // Headers
  for (let i = 0; i < columnNumber; i++) 
  {
    const headerCell = document.createElement('th');
    headerCell.textContent= table.rows[0].cells[3+i].textContent;
    matrixTable.rows[0].appendChild(headerCell);
  }

  // Body
  for (let i=0; i < rowNumber; i++)
  {
    const newRow = document.createElement('tr');

    //Criteria Cell
    const criteriaCell = document.createElement('td');
    criteriaCell.textContent = table.rows[1+i].cells[0].textContent;
    newRow.appendChild(criteriaCell);

    //Maximize Cell
    const maximizeCell = document.createElement('td');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.disabled=true;
    checkbox.checked=maximize[i]; // Put Maximize
    maximizeCell.appendChild(checkbox);
    newRow.appendChild(maximizeCell);

    // Weight cell
    const weightCell = document.createElement('td');
    weightCell.textContent = weights[i] // Put Weights
    newRow.appendChild(weightCell);

    const alternativeCount = table.rows[0].cells.length - 3; // -3 is offset
    
    for (let j = 0; j < alternativeCount; j++) 
    {
      const valueCell = document.createElement('td');
      valueCell.textContent = matrix[i][j].toFixed(4);
      newRow.appendChild(valueCell);
    }
    matrixTable.querySelector('tbody').appendChild(newRow);
  }
}

function createTableForIdeal(ideal,negativeIdeal)
{
  const idealTable = document.getElementById("ideal-negative-table");
  rowNumber = ideal.length;

  for(let i=0;i<rowNumber;i++)
  {
    const newRow = document.createElement('tr');

    //Criteria Cell
    const criteriaCell = document.createElement('td');
    criteriaCell.textContent = table.rows[1+i].cells[0].textContent;
    newRow.appendChild(criteriaCell);

    //Ideal Cell
    const idealCell = document.createElement('td');
    idealCell.textContent = ideal[i].toFixed(4);
    newRow.appendChild(idealCell);

    //Negative Ideal Cell
    const negativeIdealCell = document.createElement('td');
    negativeIdealCell.textContent = negativeIdeal[i].toFixed(4);
    newRow.appendChild(negativeIdealCell);

    idealTable.querySelector('tbody').appendChild(newRow);
  }
}

function createTableForSeperations(seperationIdeal,seperationNegativeIdeal,alternatives)
{
  const seperationTable = document.getElementById("seperation-table");

  for (let i = 0; i < alternatives.length; i++) 
    {
      const headerCell = document.createElement('th');
      headerCell.textContent= alternatives[i];
      seperationTable.rows[0].appendChild(headerCell);
      const idealCell = document.createElement('td');
      const negativeCell = document.createElement('td');
      idealCell.textContent = seperationIdeal[i].toFixed(4);
      negativeCell.textContent = seperationNegativeIdeal[i].toFixed(4);
      seperationTable.rows[1].appendChild(idealCell);
      seperationTable.rows[2].appendChild(negativeCell);
    }
}

function createTableForCloseness(closeness, alternatives)
{
  const closenessTable = document.getElementById("closeness-table");

  for (let i = 0; i < alternatives.length; i++) 
    {
      const headerCell = document.createElement('th');
      headerCell.textContent= alternatives[i];
      closenessTable.rows[0].appendChild(headerCell);
      const closenessCell = document.createElement('td');
      closenessCell.textContent = closeness[i].toFixed(4);
      closenessTable.rows[1].appendChild(closenessCell);
    }
}
//#endregion

//#region Button
// Add a new criteria (row)
addCriteriaBtn.addEventListener('click', () => {
  const newRow = document.createElement('tr');

  // Criteria cell
  const criteriaCell = document.createElement('td');
  criteriaCell.contentEditable = true;
  criteriaCell.textContent = `Criteria ${table.rows.length}`;
  newRow.appendChild(criteriaCell);

  // Maximize cell
  const maximizeCell = document.createElement('td');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  maximizeCell.appendChild(checkbox);
  newRow.appendChild(maximizeCell);
  
  // Weight cell
  const weightCell = document.createElement('td');
  const number = document.createElement('input');
  number.type = 'number'
  number.max ='1'; number.min ='0'; number.step = '0.01'; number.placeholder = '0.5';
  weightCell.appendChild(number);
  newRow.appendChild(weightCell);
  console.log(table.rows[0].cells.length);

  // Add input fields for each alternative
  const alternativeCount = table.rows[0].cells.length - 3; // -3 is offset
  for (let i = 0; i < alternativeCount; i++) 
  {
    const inputCell = document.createElement('td');
    const input = document.createElement('input');
    input.type = 'number';
    input.className = "alternativeValue"
    input.placeholder = 'Value';
    inputCell.appendChild(input);
    newRow.appendChild(inputCell);
  }

  table.querySelector('tbody').appendChild(newRow);
});

// Add a new alternative (column)
addAlternativeBtn.addEventListener('click', () => {
  const alternativeIndex = table.rows[0].cells.length - 2;

  // Add header cell
  const headerCell = document.createElement('th');
  headerCell.className = 'alternative';
  headerCell.contentEditable = 'true';
  headerCell.textContent = `Alternative ${alternativeIndex}`;
  table.rows[0].appendChild(headerCell);

  // Add input cells to all rows
  Array.from(table.rows)
    .slice(1)
    .forEach(row => {
      const inputCell = document.createElement('td');
      const input = document.createElement('input');
      input.type = 'number';
      input.className = "alternativeValue"
      input.placeholder = 'Value';
      inputCell.appendChild(input);
      row.appendChild(inputCell);
    });
});

removeCriteriaBtn.addEventListener('click', () => {
  const criteriaNumber = table.rows.length -1;
  if(criteriaNumber<=2)
    {
      alert("You have minimum criteria number.");
      return;
    } 

    table.deleteRow(criteriaNumber);
});

removeAlternativeBtn.addEventListener('click', ()=>{
  const alternativeNumber = table.rows[0].cells.length - 3
  if(alternativeNumber<=2)
  {
    alert("You have minimum alternative number.");
    return;
  }

  Array.from(table.rows)
  .forEach(row => {
    row.deleteCell(-1);
  });

});

computeBtn.addEventListener('click', () => {

  // DELETE HERE
  const table = document.getElementById("dynamic-table");
  const rows = Array.from(table.querySelectorAll("tbody tr"));
  
  const matrix = [];
  const weights = [];
  const maximize = [];
  const alternatives = [];

  rows.forEach((row, rowIndex) => {
    // Read Weights
    const weightInput = row.querySelector("input[type='number']");
    const weight = parseFloat(weightInput.value);
    weights.push(weight);

    // Read Alternatives
    const values = Array.from(row.querySelectorAll(".alternativeValue")).map(input =>
      parseFloat(input.value)
    );
    matrix.push(values);

    // Read Favorables
    const isFavorable = row.querySelector("input[type='checkbox']").checked ? 1 : 0;
    maximize.push(isFavorable);

    // Get Alternative Names
    if (rowIndex === 0) {
      const alternativeHeaders = Array.from(
        table.querySelectorAll("thead .alternative")
      ).map(header => header.textContent);
      alternatives.push(...alternativeHeaders);
    }
  });

  // Debug Purposes
  console.log("Alternatives:", alternatives);
  console.log("Matrix:", matrix);
  console.log("Weights:", weights);
  console.log("Favorable:", maximize);

  //#region Control Inputs
  if(!checkNullElementInArray(weights,0))
  {
    alert("At least one of the weight value is empty");
    return;
  }

  if(!checkNullElementInMatrix(matrix,0))
    {
      alert("At least one of the value in matrix is empty");
      return;
    }

  const sumWeights = sumArray(weights,0);
  if(sumWeights<=0.9999 || sumWeights>=1.0001)
  {
    alert(`Sum of weights is not equal to 1.\nSum of weights=${sumWeights}`);
    return;
  }

  //#endregion
 
  // TOPSIS
  const [normalized, weightedNormalized, idealSolutions, negativeSolutions, separationIdeal, separationNegative, closeness, sortedCloseness, sortedAlternatives] = compute(
    alternatives,
    matrix,
    weights,
    maximize
  );

  document.getElementById('ideal-alternative-text').textContent = sortedAlternatives[0];
  document.getElementById('ideal-alternative-ranking').textContent = sortedAlternatives.join("> ");
  document.getElementById('ideal-alternative-scores').textContent=sortedCloseness.map(x=>x.toFixed(4)).join(", ");
  resultTab.style.display = 'block';
  createTableForMatrix(normalized,weights,maximize,'normalized-table');
  createTableForMatrix(weightedNormalized,weights,maximize,'weighted-table');
  createTableForIdeal(idealSolutions,negativeSolutions);
  createTableForSeperations(separationIdeal,separationNegative,alternatives);
  createTableForCloseness(closeness,alternatives);
});
//#endregion
//#region Manual
openManualBtn.addEventListener('click', () =>{
  overlay.style.display ='block';
  popup.style.display ='block';
});

closeManualBtn.addEventListener('click', () => {
  overlay.style.display ='none';
  popup.style.display ='none';
});
//#endregion