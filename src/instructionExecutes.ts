import { ARMEmulator } from "./ARMEmulator";
import { Instruction, ThreeParameterInstruction } from "./parameterClassDefinitions";

export abstract class ThreeParameterExecutes{
    abstract Execute(ARM : ARMEmulator, Parameters : ThreeParameterInstruction) : void;
}
export class ADD extends ThreeParameterExecutes{
    constructor(){super();};
    Execute(ARM : ARMEmulator, Parameters : ThreeParameterInstruction) : void{
        ARM.setRegister(Parameters.getRd(), Parameters.getRn() + Parameters.getOperand2());
    }
}
export class SUB extends ThreeParameterExecutes{
        constructor(){super();};
    Execute(ARM : ARMEmulator, Parameters : ThreeParameterInstruction) : void{
        ARM.setRegister(Parameters.getRd(), Parameters.getRn() - Parameters.getOperand2());
    }
}
export class AND extends ThreeParameterExecutes{
    constructor(){super();};
    Execute(ARM : ARMEmulator, Parameters : ThreeParameterInstruction) : void{
        let RnBin : string = Instruction.toBinary(Parameters.getRn());
        let Operand2Bin : string = Instruction.toBinary(Parameters.getOperand2());
        let min : number = Math.min(RnBin.length, Operand2Bin.length);
        let max : number = Math.max(RnBin.length, Operand2Bin.length);
        let result : string = "";
        for(let i = 0; i < min; i++){
            if(RnBin.charAt(i) == '1' && Operand2Bin.charAt(i) == '1'){
                result += '1';
            }
            else result += '0';
        }
        for(let i = 0; i < (max-min); i++){
            result += '0';
        }
    }
}