function normalizeMatrix(matrix) {
    const colLength = matrix[0].length;
    const newMatrix = [];
  
    for (let col = 0; col < colLength; col++) {
      const column = matrix.map(row => row[col]);
      const columnSum = Math.sqrt(column.reduce((sum, x) => sum + x ** 2, 0));
  
      const normalizedColumn = columnSum === 0 
        ? column.map(() => 0) 
        : column.map(value => value / columnSum);
  
      if (newMatrix.length === 0) {
        normalizedColumn.forEach(val => newMatrix.push([val]));
      } else {
        normalizedColumn.forEach((val, i) => newMatrix[i].push(val));
      }
    }
  
    return newMatrix;
  }
  
  function constructWeightedNormalizedMatrix(matrix, weights) {
    const colLength = matrix[0].length;
    const newMatrix = [];
  
    for (let col = 0; col < colLength; col++) {
      const weightedColumn = matrix.map(row => row[col] * weights[col]);
  
      if (newMatrix.length === 0) {
        weightedColumn.forEach(val => newMatrix.push([val]));
      } else {
        weightedColumn.forEach((val, i) => newMatrix[i].push(val));
      }
    }
  
    return newMatrix;
  }
  
  function findIdealAndNegativeSolution(matrix, benefits) {
    const arrLength = matrix[0].length;
    const idealArray = Array(arrLength).fill(0);
    const negativeArray = Array(arrLength).fill(0);
  
    for (let col = 0; col < arrLength; col++) {
      const column = matrix.map(row => row[col]);
      if (benefits[col] <= 0) {
        idealArray[col] = Math.min(...column);
        negativeArray[col] = Math.max(...column);
      } else if (benefits[col] <= 1) {
        idealArray[col] = Math.max(...column);
        negativeArray[col] = Math.min(...column);
      }
    }
  
    return [idealArray, negativeArray];
  }
  
  function calculateSeparationFromIdeal(matrix, idealSolutions) {
    const rowLength = matrix[0].length;
    const colLength = matrix.length;
    const separations = Array(colLength).fill(0);
  
    for (let col = 0; col < rowLength; col++) {
      const columnModified = matrix.map(row => (row[col] - idealSolutions[col]) ** 2);
      columnModified.forEach((value, rowIdx) => {
        separations[rowIdx] += value;
      });
    }
  
    return separations.map(x => Math.sqrt(x));
  }
  
  function calculateSeparationFromNegative(matrix, negativeIdealSolutions) {
    const rowLength = matrix[0].length;
    const colLength = matrix.length;
    const separations = Array(colLength).fill(0);
  
    for (let col = 0; col < rowLength; col++) {
      const columnModified = matrix.map(row => (row[col] - negativeIdealSolutions[col]) ** 2);
      columnModified.forEach((value, rowIdx) => {
        separations[rowIdx] += value;
      });
    }
  
    return separations.map(x => Math.sqrt(x));
  }
  
  function calculateRelativeCloseness(ideal, negative, alternatives) {
    const closeness = ideal.map((val, i) => negative[i] / (val + negative[i]));
  
    const paired = closeness.map((val, i) => [val, alternatives[i]]);
    const pairedSorted = paired.sort((a, b) => b[0] - a[0]);
  
    const sortedNumbers = pairedSorted.map(pair => pair[0]);
    const sortedAlternatives = pairedSorted.map(pair => pair[1]);
  
    return [sortedNumbers, sortedAlternatives];
  }
  
  function compute(alternatives, matrix, weights, benefits) {
    const normalized = normalizeMatrix(matrix);
    const weightedNormalized = constructWeightedNormalizedMatrix(normalized, weights);
    const [idealSolutions, negativeSolutions] = findIdealAndNegativeSolution(weightedNormalized, benefits);
    const separationIdeal = calculateSeparationFromIdeal(weightedNormalized, idealSolutions);
    const separationNegative = calculateSeparationFromNegative(weightedNormalized, negativeSolutions);
    const [relativeClosenessNumbers, relativeClosenessAlternatives] = calculateRelativeCloseness(separationIdeal, separationNegative, alternatives);
    return [relativeClosenessNumbers, relativeClosenessAlternatives];
  }
  