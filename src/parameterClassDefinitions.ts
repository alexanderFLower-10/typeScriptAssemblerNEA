import { ARMEmulator } from "./ARMEmulator.js";

export class Instruction{
    static toBinary(n : number) : string{
        if(n == 0) return '';
        return this.toBinary(Math.floor(n/2)) + (n%2);
    }
    static toDenary(s : string) : number{
        let total : number = 0;
        for(let i = 0; i < s.length; i++){
            if(s.charAt(i) == '1'){
                total += Math.pow(2, s.length - (i+1));
            }
        }
        return total;
    }
    clone(...args : any[]) : this{
        const{constructor} = Object.getPrototypeOf(this);
        return new constructor(...args);
    }
}
export class ThreeParameterInstruction extends Instruction{
    private InstType : string;
    static readonly numbers : string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
    private Rd : number; private addressingType : string; private unfetchedOperand2 : number; private Instructions : string[]; private Rn: number; private operand2 : number;

    constructor(InstType : string, Rd : string, Rn : string, rawOperand2 : string){
        super();
        this.operand2 = -1;
        let placeholder : string;
        this.Instructions = ['ADD', 'SUB', 'AND', 'ORR', 'EOR', 'LSL', 'LSR']

        if(!this.Instructions.includes(InstType)) throw new Error(`Instruction type ${InstType} does not exist`);
        this.InstType = InstType;

        if(Rd.charAt(0) != 'R') throw new Error("Register should be used for the first parameter of this instrution")
        placeholder = Rd.substring(1, Rd.length);
        for(let i = 0; i < (placeholder).length; i++){
            if(!(ThreeParameterInstruction.numbers.includes(placeholder.charAt(i)))) throw new Error("Rd value of instruction is not valid");
        }
        this.Rd = Number(placeholder);

        if(Rn.charAt(0) != 'R') throw new Error("Register should be used for the second parameter of this instrution")
        placeholder = Rn.substring(1, Rn.length);
        for(let i = 0; i < (placeholder).length; i++){
            if(!ThreeParameterInstruction.numbers.includes(placeholder.charAt(i))) throw new Error("Rn value of instruction is not valid");
        }
        this.Rn = Number(placeholder);

        let temp = this.setAddressingType(rawOperand2);
        this.addressingType = temp[0];
        this.unfetchedOperand2 = temp[1];
    }
    getInstType() : string{
        return this.InstType;
    }
    getRd() : number{
        return this.Rd;
    }
    getRn() : number{
        return this.Rn;
    }
    getAddressingType() : string{
        return this.addressingType;
    }
    getOperand2() : number{
        return this.operand2;
    }

    setAddressingType(rawOperand2 : string) : [string,number]{
        let addressingType : string;
        let unfetchedOperand2 : string;
        if(rawOperand2.charAt(0) == 'R'){
            addressingType = "DR";
            unfetchedOperand2 = rawOperand2.substring(1);
        }
        else if(rawOperand2.charAt(0) == '#'){
            addressingType = "IM";
            unfetchedOperand2 = rawOperand2.substring(1);
        }
        else{
            addressingType = "DM";
            unfetchedOperand2 = rawOperand2;
        }
        
        for(let i = 0; i < unfetchedOperand2.length; i++){
            if(!ThreeParameterInstruction.numbers.includes(unfetchedOperand2.charAt(i))) throw new Error("Operand2 value of instruction is not valid");
        }
        
        return [addressingType, Number(unfetchedOperand2)];
    }

    initialiseOperand2(ARM : ARMEmulator){
        if(this.addressingType == 'DM'){
            this.operand2 = ARM.getMemory(this.unfetchedOperand2);
        }
        else if(this.addressingType == 'DR'){
            this.operand2 = ARM.getRegister(this.unfetchedOperand2);
        }
        else if(this.addressingType == 'IM'){
            this.operand2 = this.unfetchedOperand2;
        }
        
    }
    initialiseRn(ARM : ARMEmulator){
        this.Rn = ARM.getRegister(this.Rn);
        
    }
}
export class TwoParameterInstruction extends Instruction{
    private InstType : string;
    static readonly numbers : string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
    private Rd : number; private addressingType : string; private unfetchedOperand2 : number; private Instructions : string[]; private operand2 : number;

    constructor(InstType : string, Rd : string, rawOperand2 : string){
        super();
        this.operand2 = -1;
        let placeholder : string;
        this.Instructions = ['MOV', 'MVN', 'LDR', 'STR', 'CMP']
        if(!this.Instructions.includes(InstType)) throw new Error(`Instruction type ${InstType} does not exist`);
        this.InstType = InstType;

        if(Rd.charAt(0) != 'R') throw new Error("Register should be used for the first parameter of this instrution")
        placeholder = Rd.substring(1, Rd.length);
        for(let i = 0; i < (placeholder).length; i++){
            if(!(ThreeParameterInstruction.numbers.includes(placeholder.charAt(i)))) throw new Error("Rd value of instruction is not valid");
        }
        this.Rd = Number(placeholder);


        let temp = this.setAddressingType(rawOperand2);
        this.addressingType = temp[0];
        if(this.InstType == "STR" && this.addressingType != 'DM' )  throw new Error("Type STR must use addressing type direct memory for operand2 value ");
        this.unfetchedOperand2 = temp[1];
    }
    getInstType() : string{
        return this.InstType;
    }
    getRd() : number{
        return this.Rd;
    }
    getAddressingType() : string{
        return this.addressingType;
    }
    getOperand2() : number{
        return this.operand2;
    }

    setAddressingType(rawOperand2 : string) : [string,number]{
        let addressingType : string;
        let unfetchedOperand2 : string;
        if(rawOperand2.charAt(0) == 'R'){
            addressingType = "DR";
            unfetchedOperand2 = rawOperand2.substring(1);
        }
        else if(rawOperand2.charAt(0) == '#'){
            addressingType = "IM";
            unfetchedOperand2 = rawOperand2.substring(1);
        }
        else{
            addressingType = "DM";
            unfetchedOperand2 = rawOperand2;
        }
        
        for(let i = 0; i < unfetchedOperand2.length; i++){
            if(!ThreeParameterInstruction.numbers.includes(unfetchedOperand2.charAt(i))) throw new Error("Operand2 value of instruction is not valid");
        }
        
        return [addressingType, Number(unfetchedOperand2)];
    }

    initialiseOperand2(ARM : ARMEmulator){
        // if it was STR then I need just the memory location to be parsed as operand 2 so I can store the data in that location
        if(this.InstType != 'STR'){
            if(this.addressingType == 'DM'){
                this.operand2 = ARM.getMemory(this.unfetchedOperand2);
            }
            else if(this.addressingType == 'DR'){
                this.operand2 = ARM.getRegister(this.unfetchedOperand2);
            }
            else if(this.addressingType == 'IM'){
                this.operand2 = this.unfetchedOperand2;
            }
        }
        else this.operand2 = this.unfetchedOperand2;

    }
    
}

export class BranchInst extends Instruction{
    private condition : string; private conditions : string[];  private label : string;
    constructor(part1 : string, part2 : string){
        super();
        this.conditions = ['EQ', 'NE', 'LT', 'GT'];
        this.condition = part1.substring(1);
        if((!this.conditions.includes(this.condition))){
            if(this.condition.length == 0){
                // uncodintional
                this.condition = "UC";
            }
            else{
             throw new Error(`Condition ${this.condition} does not exist`);
            }
        }
        this.label = part2;
    }
    getCondition() : string{
        return this.condition;
    }
    getLabel() : string{
        return this.label;
    }
}

export class WhiteSpace extends Instruction{
    constructor(){
        super();
    }
}

export class Label extends Instruction{
    label : string;

    constructor(line : string){
        super();
        if(line.charAt(line.length-1) != ":") throw new Error("Instruction not identified, did you use a colon at the end of your label?");
        this.label = line.substring(0, line.length-1);
    }
    getLabel() : string{
        return this.label;
    }
}

export class HALT extends Instruction{ 
    constructor() {
        super();
    }
}


