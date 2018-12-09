const dea = input => input.split('').map(char => char + char).join('x');
const dec = input => input.split('').map(char => String.fromCharCode(char.charCodeAt(0) - 3)).join('');
const abracadabra = a => a+1;

export { dec, abracadabra };
export default dea; 