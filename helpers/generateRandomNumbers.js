// Función para generar una cifra de 4 números aleatorios
const generateRandomNumbers = () => {
    var sixDigits = '';

    // Generar 4 números aleatorios y concatenarlos
    for (var i = 0; i < 4; i++) {
        var ramdonNum = Math.floor(Math.random() * 10); // Números del 0 al 9
        sixDigits += ramdonNum;
    }

    return sixDigits;
}

module.exports = generateRandomNumbers;