export function getValue(key) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
}

export function setValue(key, value) {
    console.log(`setting key : ${key} , value : ${value} in LS`);
    localStorage.setItem(key, JSON.stringify(value));
}

export function clearValue(key) {
    localStorage.removeItem(key);
}