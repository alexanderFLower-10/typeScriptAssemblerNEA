import { ThreeParameterInstruction, TwoParameterInstruction, BranchInst, WhiteSpace, Label, HALT } from './parameterClassDefinitions.js';
export function getInstFromArr(arr) {
    let current = '';
    const result = [];
    let splitInst = [];
    for (let i = 0; i < arr.length; i++) {
        current = arr[i];
        splitInst = current.split(" ");
        switch (splitInst.length) {
            case 4:
                for (let j = 1; j < splitInst.length - 1; j++) {
                    if (splitInst[j].charAt(splitInst[j].length - 1) == ',') {
                        splitInst[j] = splitInst[j].substring(0, splitInst[j].length - 1);
                    }
                    else
                        throw new Error("Comma not found");
                }
                result[i] = new ThreeParameterInstruction(splitInst[0], splitInst[1], splitInst[2], splitInst[3]);
                break;
            case 3:
                if (splitInst[1].charAt(splitInst[1].length - 1) == ',') {
                    splitInst[1] = splitInst[1].substring(0, splitInst[1].length - 1);
                }
                else
                    throw new Error("Comma not found");
                result[i] = new TwoParameterInstruction(splitInst[0], splitInst[1], splitInst[2]);
                break;
            case 2:
                result[i] = new BranchInst(splitInst[0], splitInst[1]);
                break;
            case 1:
                if (current == "HALT")
                    result[i] = new HALT();
                else
                    result[i] == new Label(current);
                break;
            case 0:
                result[i] = new WhiteSpace();
        }
    }
    return result;
}
