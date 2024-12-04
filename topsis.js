function normalizeMatrix(matrix) 
{
    const newMatrix = [];
  
    for (let row of matrix) {
        const rowSum = Math.sqrt(row.reduce((sum, x) => sum + x ** 2, 0));
        
        const normalizedRow = rowSum === 0 ? row.map(() => 0) : row.map(x => x / rowSum);
        
        newMatrix.push(normalizedRow);
    }

    console.log(newMatrix);
  
    return newMatrix;
}
  
function constructWeightedNormalizedMatrix(matrix, weights) 
{
  const newMatrix = [];

  for (let i=0;i<weights.length;i++)
  {
    const row= matrix[i];
    weightedRow= row.map(value=> value*weights[i]);
    newMatrix.push(weightedRow);
  }

  console.log(newMatrix);
  return newMatrix;
}

function findIdealAndNegativeSolution(matrix, isFavorable) 
{
  const arrLength = matrix.length;
  const idealArray = Array(arrLength).fill(0);
  const negativeArray = Array(arrLength).fill(0);
  for (let rowIndex = 0; rowIndex < arrLength; rowIndex++) {
    row=matrix[rowIndex];
    if (isFavorable[rowIndex] <= 0) {
      idealArray[rowIndex] = Math.min(...row);
      negativeArray[rowIndex] = Math.max(...row);
    } else if (isFavorable[rowIndex] <= 1) {
      idealArray[rowIndex] = Math.max(...row);
      negativeArray[rowIndex] = Math.min(...row);
    }
  }

  console.log(idealArray);
  console.log(negativeArray);
  return [idealArray, negativeArray];
}

function calculateSeparationFromIdeal(matrix, idealSolutions, negativeSolutions) 
{
  const altLength = matrix[0].length;
  const separationsIdeal = Array(idealSolutions.length).fill(0);
  const separationsNegative = Array(idealSolutions.length).fill(0);
  for(let i=0;i<altLength;i++)
  {
    const diffIdeal=matrix[i].map(x=> (x-idealSolutions[i])**2);
    const diffNegative=matrix[i].map(x=> (x- negativeSolutions[i])**2);
    diffIdeal.forEach((value,j)=>{
      separationsIdeal[j]+=value;
    });
    diffNegative.forEach((value,j)=>{
      separationsNegative[j]+=value;
    });
  }
  
  console.log(separationsIdeal.map(x => Math.sqrt(x)));
  console.log(separationsNegative.map(x => Math.sqrt(x)));
  return [separationsIdeal.map(x => Math.sqrt(x)), separationsNegative.map(x=>Math.sqrt(x))];
}

function calculateRelativeCloseness(ideal, negative, alternatives) 
{
  const closeness = ideal.map((val, i) => negative[i] / (val + negative[i]));

  const paired = closeness.map((val, i) => [val, alternatives[i]]);
  const pairedSorted = paired.sort((a, b) => b[0] - a[0]);

  const sortedNumbers = pairedSorted.map(pair => pair[0]);
  const sortedAlternatives = pairedSorted.map(pair => pair[1]);

  return [sortedNumbers, sortedAlternatives];
}

function compute(alternatives, matrix, weights, favorable) 
{
  const normalized = normalizeMatrix(matrix);
  const weightedNormalized = constructWeightedNormalizedMatrix(normalized, weights);
  const [idealSolutions, negativeSolutions] = findIdealAndNegativeSolution(weightedNormalized, favorable);
  const [separationIdeal,separationNegative] = calculateSeparationFromIdeal(weightedNormalized, idealSolutions,negativeSolutions);
  const [relativeClosenessNumbers, relativeClosenessAlternatives] = calculateRelativeCloseness(separationIdeal, separationNegative, alternatives);
  return [relativeClosenessNumbers, relativeClosenessAlternatives];
}
