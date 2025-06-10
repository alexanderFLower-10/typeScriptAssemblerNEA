import { ARMEmulator } from "./ARMEmulator";
import { Instruction, ThreeParameterInstruction, TwoParameterInstruction } from "./parameterClassDefinitions";

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
        let max : number = Math.max(RnBin.length, Operand2Bin.length);
        let result : string = "";
        RnBin = RnBin.padStart(max, '0');
        Operand2Bin = Operand2Bin.padStart(max, '0');
        for(let i = 0; i < max; i++){
            result += RnBin.charAt(i) == '1' && Operand2Bin.charAt(i) == '1' ? '1' : '0'; 
        }
        let value = Instruction.toDenary(result.replace(/^0+/, ''));
        ARM.setRegister(Parameters.getRd(), value);
    }
}
export class ORR extends ThreeParameterExecutes{
    constructor(){super();};
    Execute(ARM : ARMEmulator, Parameters : ThreeParameterInstruction) : void{
        let RnBin : string = Instruction.toBinary(Parameters.getRn());
        let Operand2Bin : string = Instruction.toBinary(Parameters.getOperand2());
        let max : number = Math.max(RnBin.length, Operand2Bin.length);
        let result : string = "";
        RnBin = RnBin.padStart(max, '0');
        Operand2Bin = Operand2Bin.padStart(max, '0');
        for(let i = 0; i < max; i++){
            result += RnBin.charAt(i) == '1' || Operand2Bin.charAt(i) == '1' ? '1' : '0'; 
        }
        let value = Instruction.toDenary(result.replace(/^0+/, ''));
        ARM.setRegister(Parameters.getRd(), value);
    }
}
export class EOR extends ThreeParameterExecutes{
    constructor(){super();};
    Execute(ARM : ARMEmulator, Parameters : ThreeParameterInstruction) : void{
        let RnBin : string = Instruction.toBinary(Parameters.getRn());
        let Operand2Bin : string = Instruction.toBinary(Parameters.getOperand2());
        let max : number = Math.max(RnBin.length, Operand2Bin.length);
        let result : string = "";
        RnBin = RnBin.padStart(max, '0');
        Operand2Bin = Operand2Bin.padStart(max, '0');
        for(let i = 0; i < max; i++){
            result += (RnBin.charAt(i) == '1' && Operand2Bin.charAt(i) == '0' ) || (RnBin.charAt(i) == '0' && Operand2Bin.charAt(i) == '1' ) ? '1' : '0';
        }
        let value = Instruction.toDenary(result.replace(/^0+/, ''));
        ARM.setRegister(Parameters.getRd(), value);
    }
}
export class LSL extends ThreeParameterExecutes{
    constructor(){super();};
    Execute(ARM : ARMEmulator, Parameters : ThreeParameterInstruction) : void{
        let result : number = Parameters.getRn() * Math.pow(2, Parameters.getOperand2());
        ARM.setRegister(Parameters.getRd(), result);

    }
}
export class LSR extends ThreeParameterExecutes{
    constructor(){super();};
    Execute(ARM : ARMEmulator, Parameters : ThreeParameterInstruction) : void{
        let result : number = Parameters.getRn() * Math.pow(2,1/ Parameters.getOperand2());
        ARM.setRegister(Parameters.getRd(), result);
        
    }
}

export abstract class TwoParameterExecutes{
    abstract Execute(ARM : ARMEmulator, Parameters : TwoParameterInstruction) : void;
}
export class MOV extends TwoParameterExecutes{
    constructor(){super();}
    Execute(ARM : ARMEmulator, Parameters : TwoParameterInstruction) : void{
        ARM.setRegister(Parameters.getRd(), Parameters.getOperand2());
    }
}
export class MVN extends TwoParameterExecutes{
    constructor(){super();}
    Execute(ARM : ARMEmulator, Parameters : TwoParameterInstruction) : void{
        let initial : string = Instruction.toBinary(Parameters.getOperand2());
        let result = "";
        for(let i = 0; i < initial.length; i++){
            result+= initial.charAt(i) == '1' ? '0' : '1';
        }
        ARM.setRegister(Parameters.getRd(), Instruction.toDenary(result));
    }
}
export class LDR extends TwoParameterExecutes{
    constructor(){super();}
    Execute(ARM : ARMEmulator, Parameters : TwoParameterInstruction) : void{
        ARM.setRegister(Parameters.getRd(), ARM.getMemory(Parameters.getOperand2()));
    }
}
export class STR extends TwoParameterExecutes{
    constructor(){super();}
    Execute(ARM : ARMEmulator, Parameters : TwoParameterInstruction) : void{
        ARM.setMemory(Parameters.getOperand2(), para)
    }
}