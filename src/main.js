import { getInstFromArr } from './mainFunctions.js';
import { ARMEmulator } from './ARMEmulator.js';
let ARM = new ARMEmulator([]);
const assembleButton = document.getElementById("assembleProgram");
assembleButton.addEventListener("click", assembleProgram);
const stepButton = document.getElementById("step");
stepButton.addEventListener("click", Step);
const programInputArea = document.getElementById("submitProgramArea");
function resetMemory() {
    for (let i = 0; i < 24; i++) {
        let elementToChange = document.getElementById('M' + i);
        elementToChange.textContent = i + (String(i).length == 1 ? ":  " : ": ") + '0';
    }
}
function resetRegisters() {
    for (let i = 0; i < 24; i++) {
        let elementToChange = document.getElementById('R' + i);
        elementToChange.textContent = "R" + i + (String(i).length == 1 ? ":  " : ": ") + '0';
    }
}
function assembleProgram() {
    resetRegisters();
    resetMemory();
    let value = programInputArea.value;
    if (value == "")
        throw new Error("No code to be assembled");
    let array = value.split("\n");
    let instList = getInstFromArr(array);
    ARM = new ARMEmulator(instList);
}
function Step() {
    ARM.assembled() ? ARM.Step() : alert("Please assemble before stepping");
}
