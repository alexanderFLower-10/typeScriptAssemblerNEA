import { BranchInst, HALT, Instruction, Label, ThreeParameterInstruction, TwoParameterInstruction, WhiteSpace } from "./parameterClassDefinitions.js";

export class ARMEmulator{
    private registers :  number[]; private memory : number[]; private PC : number; private instList : Instruction[]; private cap : number; private stateHistory : Stack<ARMEmulatorState>; 
    constructor(instList : Instruction[]) {
        this.stateHistory = new Stack();
        this.instList = instList;
        this.registers = [];
        this.memory = [];
        this.PC = 0;
        this.cap = 23;
    }
    
    Step(){
        this.stateHistory.Push(this.getState());
        
        if(this.instList[this.PC] instanceof ThreeParameterInstruction){

            
            let currentInst : ThreeParameterInstruction = this.instList[this.PC] as ThreeParameterInstruction;
            currentInst.initialiseOperand2(this);
            currentInst.initialiseRn(this);
        }
        else if(this.instList[this.PC] instanceof TwoParameterInstruction){
            let currentInst : TwoParameterInstruction = this.instList[this.PC] as TwoParameterInstruction;
            currentInst.initialiseOperand2(this);
        } 
        else if(this.instList[this.PC] instanceof BranchInst){
            let currentInst : BranchInst = this.instList[this.PC] as BranchInst;
        }
        else if(this.instList[this.PC] instanceof Label){
            let currentInst : Label = this.instList[this.PC] as Label;
        }
        else if(this.instList[this.PC] instanceof WhiteSpace){

        }
        else if(this.instList[this.PC] instanceof HALT){

        }


        
        this.PC++;
    }
    StepBack(){
        this.loadState(this.stateHistory.Pop());
    }

    getPC(){ return this.PC;}
    setRegister(index : number, value : number){
        if(index > this.cap) throw new Error("Register does not exist on line " + this.PC);
        this.registers[index] = value;
    }
    setMemory(index: number, value : number){
        if(index > this.cap) throw new Error("Memory Address does not exist on line " + this.PC);
        this.memory[index] = value;
    }
    getRegister(index : number) : number{
        return this.registers[index];
    }
    getMemory(index : number)  : number{
        return this.memory[index];
    }
    getState(): ARMEmulatorState{
        return new ARMEmulatorState(this);
    }
    loadState(state : ARMEmulatorState){
        this.memory = state.getAllMemory();
        this.registers = state.getAllRegisters();
        this.PC = state.getPC();
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
    private registers : number[]; private memory :number[]; private PC : number;
    constructor(ARM : ARMEmulator) {
        this.registers = [];
        this.memory = [];
        for(let i = 0; i < 23; i++){
            this.registers[i] = ARM.getRegister(i);
            this.memory[i] = ARM.getMemory(i);
        }
        this.PC = ARM.getPC();
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
}