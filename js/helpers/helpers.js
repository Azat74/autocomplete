// случайное целое число
export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}