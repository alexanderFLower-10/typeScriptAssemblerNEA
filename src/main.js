import { getInstFromArr } from './mainFunctions.js';
import { ThreeParameterInstruction, TwoParameterInstruction, BranchInst, WhiteSpace, Label } from './parameterClassDefinitions.js';
const assembleButton = document.getElementById("assembleProgram");
assembleButton.addEventListener("click", assembleProgram);
const textarea = document.getElementById("submitProgramArea");
function assembleProgram() {
    let value = textarea.value;
    if (value == "")
        throw new Error("No code to be assembled");
    let array = value.split("\n");
    let instList = getInstFromArr(array);
    for (let i = 0; i < instList.length; i++) {
        if (typeof (instList[i]) == typeof (ThreeParameterInstruction)) {
            let current = instList[i];
            console.log(current.getInstType() + " " + current.getRd() + " " + current.getRn() + " " + current.getUnfetchedOperand2() + " " + current.getAddressingType());
        }
        else if (typeof (instList[i]) == typeof (TwoParameterInstruction)) {
            let current = instList[i];
            console.log(current.getInstType() + " " + current.getRd() + " " + current.getUnfetchedOperand2() + " " + current.getAddressingType());
        }
        else if (typeof (instList[i]) == typeof (WhiteSpace))
            console.log("whitespace");
        else if (typeof (instList[i]) == typeof (BranchInst)) {
            let current = instList[i];
            console.log(current.getCondition() + " " + current.getLabel());
        }
        else if (typeof (instList[i]) == typeof (Label)) {
            let current = instList[i];
            console.log("Label = " + current.getLabel());
        }
    }
}
