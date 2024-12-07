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

// Add a new criteria (row)
addCriteriaBtn.addEventListener('click', () => {
  const newRow = document.createElement('tr');

  // Criteria cell
  const criteriaCell = document.createElement('td');
  criteriaCell.contentEditable = true;
  criteriaCell.textContent = `Criteria ${table.rows.length}`;
  newRow.appendChild(criteriaCell);

  // Favorable cell
  const favorableCell = document.createElement('td');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  favorableCell.appendChild(checkbox);
  newRow.appendChild(favorableCell);
  
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
  for (let i = 0; i < alternativeCount; i++) {
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

  const table = document.getElementById("dynamic-table");
  const rows = Array.from(table.querySelectorAll("tbody tr"));
  
  const matrix = [];
  const weights = [];
  const favorable = [];
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
    favorable.push(isFavorable);

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
  console.log("Favorable:", favorable);

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
  const [relativeClosenessNumbers, sortedAlternatives] = compute(
    alternatives,
    matrix,
    weights,
    favorable
  );

  document.getElementById('ideal-alternative-text').textContent = sortedAlternatives[0];
  document.getElementById('ideal-alternative-ranking').textContent = sortedAlternatives.join("> ");
  document.getElementById('ideal-alternative-scores').textContent=relativeClosenessNumbers.join(", ");
  resultTab.style.display = 'block';
});

openManualBtn.addEventListener('click', () =>{
  overlay.style.display ='block';
  popup.style.display ='block';
});

closeManualBtn.addEventListener('click', () => {
  overlay.style.display ='none';
  popup.style.display ='none';
});