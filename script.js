const metodeInputSelect = document.getElementById('metode-input');
const inputManualDiv = document.getElementById('input-manual');
const inputFileDiv = document.getElementById('input-file');
const uploadFileInput = document.getElementById('upload-file');
const ukuranInput = document.getElementById('ukuran');
const matriksInput = document.getElementById('matriks-input');
const hitungButton = document.getElementById('hitung');
const hasilDiv = document.getElementById('hasil');

function generateMatriksInput(ukuran) {
  let html = '';
  for (let i = 0; i < ukuran; i++) {
    for (let j = 0; j < ukuran; j++) {
      html += `<input type="number" id="m${i}${j}" class="input-matriks" value="0">`;
    }
    html += '<br>';
  }
  matriksInput.innerHTML = html;
}

function getMatriksValues(ukuran) {
  const matriks = [];
  for (let i = 0; i < ukuran; i++) {
    matriks[i] = [];
    for (let j = 0; j < ukuran; j++) {
      const value = parseFloat(document.getElementById(`m${i}${j}`).value);
      if (isNaN(value)) {
        displayError(`Masukkan angka valid pada baris ${i + 1}, kolom ${j + 1}.`);
        return null;
      }
      matriks[i][j] = value;
    }
  }
  return matriks;
}

function inversMatriks(matriks) {
  const n = matriks.length;
  const identitas = [];
  for (let i = 0; i < n; i++) {
    identitas[i] = [];
    for (let j = 0; j < n; j++) {
      identitas[i][j] = i === j ? 1 : 0;
    }
    matriks[i] = [...matriks[i], ...identitas[i]];
  }

  for (let i = 0; i < n; i++) {
    let pivot = matriks[i][i];
    if (pivot === 0) {
      for (let j = i + 1; j < n; j++) {
        if (matriks[j][i] !== 0) {
          [matriks[i], matriks[j]] = [matriks[j], matriks[i]];
          pivot = matriks[i][i];
          break;
        }
      }
      if (pivot === 0) {
        return null;
      }
    }

    for (let j = 0; j < 2 * n; j++) {
      matriks[i][j] /= pivot;
    }

    for (let j = 0; j < n; j++) {
      if (i !== j) {
        const faktor = matriks[j][i];
        for (let k = 0; k < 2 * n; k++) {
          matriks[j][k] -= faktor * matriks[i][k];
        }
      }
    }
  }

  const invers = [];
  for (let i = 0; i < n; i++) {
    invers[i] = matriks[i].slice(n);
  }
  return invers;
}

function displayHasil(matriks, invers) {
  let html = '<h2>Matriks Asli:</h2><table>';
  for (let i = 0; i < matriks.length; i++) {
    html += '<tr>';
    for (let j = 0; j < matriks[i].length; j++) {
      html += `<td>${matriks[i][j]}</td>`;
    }
    html += '</tr>';
  }
  html += '</table>';
  
  html += '<h2>Matriks Invers:</h2><table>';
  for (let i = 0; i < invers.length; i++) {
    html += '<tr>';
    for (let j = 0; j < invers[i].length; j++) {
      html += `<td>${invers[i][j]}</td>`;
    }
    html += '</tr>';
  }
  html += '</table>';

  hasilDiv.innerHTML = html;
}

function displayError(message) {
  hasilDiv.innerHTML = `<p class="error">${message}</p>`;
}

function parseMatriksFromFile(fileContent) {
  const baris = fileContent.trim().split('\n');
  const matriks = [];
  for (let i = 0; i < baris.length; i++) {
    const elemen = baris[i].trim().split(/\s+/).map(Number);
    if (elemen.length !== baris.length || elemen.some(isNaN)) {
      displayError('Format file tidak valid.');
      return null;
    }
    matriks.push(elemen);
  }
  return matriks;
}

function hitungDanTampilkanInvers(matriks) {
  const invers = inversMatriks(matriks);
  if (invers) {
    displayHasil(matriks, invers);
  } else {
    displayError('Matriks tidak memiliki invers.');
  }
}

metodeInputSelect.addEventListener('change', () => {
  const metodeInput = metodeInputSelect.value;
  if (metodeInput === 'manual') {
    inputManualDiv.style.display = 'block';
    inputFileDiv.style.display = 'none';
  } else {
    inputManualDiv.style.display = 'none';
    inputFileDiv.style.display = 'block';
  }
});

ukuranInput.addEventListener('input', () => {
  const ukuran = parseInt(ukuranInput.value);
  generateMatriksInput(ukuran);
});

hitungButton.addEventListener('click', () => {
  const metodeInput = metodeInputSelect.value;
  let matriks;

  if (metodeInput === 'manual') {
    const ukuran = parseInt(document.getElementById('ukuran').value);
    matriks = getMatriksValues(ukuran);
    if (matriks) {
      hitungDanTampilkanInvers(matriks);
    }
  } else {
    const file = uploadFileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        matriks = parseMatriksFromFile(event.target.result);
        if (matriks) {
          hitungDanTampilkanInvers(matriks);
        }
      };
      reader.readAsText(file);
    } else {
      displayError('Pilih file matriks terlebih dahulu.');
    }
  }
});

generateMatriksInput(parseInt(ukuranInput.value));