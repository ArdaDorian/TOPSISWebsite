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
  const idealArray = Array(arrLength.length).fill(0);
  const negativeArray = Array(arrLength.length).fill(0);
  for (let i = 0; i < arrLength; i++) {
    row=matrix[i];
    if (isFavorable[i] <= 0) {
      idealArray[i] = Math.min(...row);
      negativeArray[i] = Math.max(...row);
    } else if (isFavorable[i] <= 1) {
      idealArray[i] = Math.max(...row);
      negativeArray[i] = Math.min(...row);
    }
  }

  console.log(idealArray);
  console.log(negativeArray);
  return [idealArray, negativeArray];
}

function calculateSeparationFromIdeal(matrix, idealSolutions, negativeSolutions) 
{
  const arrLength = matrix[0].length;
  const separationsIdeal = Array(arrLength).fill(0);
  const separationsNegative = Array(arrLength).fill(0);
  
  for(let i=0;i<matrix.length;i++)
  {
    const diffIdeal=matrix[i].map(x=> (x-idealSolutions[i])**2);
    const diffNegative=matrix[i].map(x=> (x- negativeSolutions[i])**2);

    for (let j = 0; j < arrLength; j++) 
      {
        separationsIdeal[j]+=diffIdeal[j];
        separationsNegative[j]+=diffNegative[j];
      }
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
