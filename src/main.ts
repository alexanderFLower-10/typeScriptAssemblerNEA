import{
    getInstFromArr
} from './mainFunctions.js';
import{
    ARMEmulator
} from './ARMEmulator.js'
import { Instruction } from './parameterClassDefinitions.js';
export const programInputArea = document.getElementById("submitProgramArea") as HTMLTextAreaElement;
let ARM : ARMEmulator = new ARMEmulator([]);

const assembleButton  = document.getElementById("assembleProgram") as HTMLButtonElement;
assembleButton.addEventListener("click", assembleProgram);
const stepButton = document.getElementById("step") as HTMLButtonElement;
stepButton.addEventListener("click", Step);

function resetMemory(){
    for(let i = 0; i < 24; i++){
        let elementToChange = document.getElementById('M' + i) as HTMLPreElement;
        elementToChange.textContent = i + (String(i).length == 1 ? ":  " : ": ") + '0';
    }
}
function resetRegisters(){
    for(let i = 0; i < 24; i++){
        let elementToChange = document.getElementById('R' + i) as HTMLPreElement;
        elementToChange.textContent = "R" + i + (String(i).length == 1 ? ":  " : ": ") + '0';
    }
}
function assembleProgram(){
    resetRegisters();
    resetMemory();
    let value: string = programInputArea.value;
    if(value == "") throw new Error("No code to be assembled");
    let array : string[] = value.split("\n");
    let instList : Instruction[] = getInstFromArr(array);    
    ARM = new ARMEmulator(instList);
    programInputArea.readOnly = true;
} 
function Step(){
    ARM.assembled() ? ARM.Step() : alert("Please assemble before stepping");
}



