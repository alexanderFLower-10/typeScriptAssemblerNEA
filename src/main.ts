import{
    getInstFromArr
} from './mainFunctions.js';
import{
    ARMEmulator
<<<<<<< HEAD
} from './ARMEmulator.js'
import { Instruction } from './parameterClassDefinitions.js';
=======
} from './emulatorExecutesClass.js'
import { Instruction, ThreeParameterInstruction, TwoParameterInstruction, BranchInst, WhiteSpace, Label } from './parameterClassDefinitions.js';
>>>>>>> 4261f96a64a7c18698e89e75cc27bd73bc020556

const assembleButton  = document.getElementById("assembleProgram") as HTMLButtonElement;
assembleButton.addEventListener("click", assembleProgram);
const textarea = document.getElementById("submitProgramArea") as HTMLTextAreaElement;

function assembleProgram(){
    let value: string = textarea.value;
    if(value == "") throw new Error("No code to be assembled");
    let array : string[] = value.split("\n");
    let instList : Instruction[] = getInstFromArr(array);    
<<<<<<< HEAD
} 


=======
    for(let i = 0; i < instList.length; i++){
        if(typeof(instList[i]) == typeof(ThreeParameterInstruction)){
            let current : ThreeParameterInstruction = instList[i] as ThreeParameterInstruction;
            console.log(current.getInstType() +" " + current.getRd() +" " + current.getRn() + " " +current.getUnfetchedOperand2() +" " + current.getAddressingType());
        }
        else if(typeof(instList[i]) == typeof(TwoParameterInstruction)){
            let current : TwoParameterInstruction = instList[i] as TwoParameterInstruction;
            console.log(current.getInstType() + " " + current.getRd() + " " +current.getUnfetchedOperand2() +" " +current.getAddressingType());
        }
        else if(typeof(instList[i]) == typeof(WhiteSpace))console.log("whitespace");
        else if(typeof(instList[i]) == typeof(BranchInst)){
            let current : BranchInst = instList[i] as BranchInst;
            console.log(current.getCondition() + " " +  current.getLabel());
        }
                else if(typeof(instList[i]) == typeof(Label)){
            let current :Label = instList[i] as Label;
            console.log("Label = " + current.getLabel());
        }
        
    }
}
>>>>>>> 4261f96a64a7c18698e89e75cc27bd73bc020556

