import { ADD, AND, BEQ, BGT, BLT, BNE, BranchExecutes, BUC, CMP, EOR, LDR, LSL, LSR, MOV, MVN, ORR, STR, SUB, ThreeParameterExecutes, TwoParameterExecutes } from "./instructionExecutes.js";
import { programInputArea } from "./main.js";
import { BranchInst, HALT, Instruction, Label, ThreeParameterInstruction, TwoParameterInstruction, WhiteSpace } from "./parameterClassDefinitions.js";
interface StringMap<T>{
    [key : string]: T;
}
export class ARMEmulator{
    private registers :  number[]; private memory : number[]; private PC : number; private SR : string; private instList : Instruction[]; private cap : number; private stateHistory : Stack<ARMEmulatorState>; private labelMap : StringMap<number>; private ThreeParameterInstructionMap : StringMap<new () => ThreeParameterExecutes>; private TwoParameterInstructionMap : StringMap<new () => TwoParameterExecutes>; private BranchesInstructionMap : StringMap<new () => BranchExecutes>; private Assembled : boolean; 


    constructor(instList : Instruction[]) {
        this.stateHistory = new Stack();
        this.instList = instList;
        this.cap = 24;
        this.registers = Array(this.cap).fill(0);
        this.memory = Array(this.cap).fill(0);
        this.PC = 0;
        this.SR = '';
        this.labelMap = this.initalPassMap();
        this.ThreeParameterInstructionMap = {
            'ADD' : ADD,
            'SUB' : SUB,
            'AND' : AND,
            'ORR' : ORR,
            'EOR' : EOR,
            'LSL' : LSL,
            'LSR' : LSR,
        }
        this.TwoParameterInstructionMap = {
            'MOV' : MOV,
            'MVN' : MVN,
            'LDR' : LDR,
            'STR' : STR,
            'CMP' : CMP,
        }
        this.BranchesInstructionMap = {
            'EQ' : BEQ,
            'GT' : BGT,
            'LT' : BLT,
            'NE' : BNE,
            'UC' : BUC,

        }      
        this.Assembled = instList.length == 0 ? false : true;   
    }
    private initalPassMap() : StringMap<number>  {
        let result : StringMap<number> = {};
        for(let i = 0; i < this.instList.length; i++){
            if(this.instList[i] instanceof Label){
                let temp : Label = this.instList[i] as Label;
                result[temp.getLabel()] = i;
            }
        }
        return result;
    }
    assembled() {return this.Assembled;}
    Step(){
        this.stateHistory.Push(this.getState());
        if(!(this.instList[this.PC] instanceof WhiteSpace)) {
            let tempArr = programInputArea.value.split('\n');
            tempArr[this.PC] = tempArr[this.PC] +  "   " + "<";
            this.PC != 0 ? tempArr[this.PC-1] = tempArr[this.PC-1].substring(0, tempArr[this.PC-1].length -4) : null;
            programInputArea.value = tempArr.join('\n');
        }
        if(this.instList[this.PC] instanceof ThreeParameterInstruction){   
            let currentInst : ThreeParameterInstruction = this.instList[this.PC].clone() as ThreeParameterInstruction;
            currentInst.initialiseOperand2(this);
            currentInst.initialiseRn(this);
            let currentExecute = new this.ThreeParameterInstructionMap[currentInst.getInstType()]();
            currentExecute.Execute(this, currentInst);
            let Rd = currentInst.getRd();
            let elementToChange = document.getElementById('R' + Rd) as HTMLPreElement;
            elementToChange.textContent = "R" + Rd + (String(Rd).length == 1 ? ":  " : ": ") + this.registers[Rd];
        }
        else if(this.instList[this.PC] instanceof TwoParameterInstruction){
            let currentInst : TwoParameterInstruction = this.instList[this.PC] as TwoParameterInstruction;
            currentInst.initialiseOperand2(this);
            let currentExecute = new this.TwoParameterInstructionMap[currentInst.getInstType()]();
            currentExecute.Execute(this, currentInst);
            let Rd = currentInst.getRd()
            if(!(currentExecute instanceof STR)){
                let elementToChange = document.getElementById('R' + Rd) as HTMLPreElement;
                elementToChange.textContent = "R" + Rd + (String(Rd).length == 1 ? ":  " : ": ") + this.registers[Rd];
            }
            else{
                let memoryAddy = currentInst.getOperand2();
                let elementToChange = document.getElementById('M' + memoryAddy) as HTMLPreElement;
                elementToChange.textContent = memoryAddy + (String(memoryAddy).length == 1 ? ":  " : ": ") + this.registers[Rd];      
            }
        } 
        else if(this.instList[this.PC] instanceof BranchInst){
            let currentInst : BranchInst = this.instList[this.PC] as BranchInst;
            let currentExecute = new this.BranchesInstructionMap[currentInst.getCondition()]();
            currentExecute.Execute(this, currentInst);
        }
        else if(this.instList[this.PC] instanceof HALT){
            this.HALT();
        }


        
        this.PC++;
    }
    StepBack(){
        this.loadState(this.stateHistory.Pop());
    }
    HALT(){
        
    }
    getPC(){ return this.PC;}
    getSR(){return this.SR;}
    getRegister(index : number) : number{
        return this.registers[index];
    }
    getMemory(index : number)  : number{
        return this.memory[index];
    }
    getState(): ARMEmulatorState{
        return new ARMEmulatorState(this);
    }
    getLabelLocation(label : string) : number{
        if(label in this.labelMap) return this.labelMap[label];
        else throw Error("Label " + label + " does not exist")
    }
    setRegister(index : number, value : number){
        if(index > this.cap) throw new Error("Register does not exist on line " + this.PC);
        this.registers[index] = value;
    }
    setMemory(index: number, value : number){
        if(index > this.cap) throw new Error("Memory Address does not exist on line " + this.PC);
        this.memory[index] = value;
    }
    setPC(value : number){
        this.PC = value;
    }
    setSR(value : string){
        this.SR = value;
    }
    loadState(state : ARMEmulatorState){
        this.memory = state.getAllMemory();
        this.registers = state.getAllRegisters();
        this.PC = state.getPC();
        this.SR = state.getSR()
    }

}
class Stack<T>{
    stack : T[]; front; length;
        constructor(){
        this.stack = [];
        this.front = -1;
        this.length = 0;
    }
    Push(value : T){
        this.front++;
        this.stack[this.front] = value;
        this.length++;
    }
    Pop() : T{
        if(this.length == 0) throw new Error("Cannot step back anymore");
        let temp : T = this.stack[this.front];
        this.front--;
        this.length--;
        return temp;
    

    }

}
class ARMEmulatorState{
    private registers : number[]; private memory :number[]; private PC : number; private SR : string;
    constructor(ARM : ARMEmulator) {
        this.registers = [];
        this.memory = [];
        for(let i = 0; i < 23; i++){
            this.registers[i] = ARM.getRegister(i);
            this.memory[i] = ARM.getMemory(i);
        }
        this.PC = ARM.getPC();
        this.SR = ARM.getSR();
    }
    getAllRegisters(){
        return this.registers;
    }
    getAllMemory(){
        return this.memory;
    }
    getPC(){
        return this.PC;
    }
    getSR(){
        return this.SR;
    }
}