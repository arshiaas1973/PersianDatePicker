class ArrayTools{
    static getMaximumInnerArrayLength(array: any[][]){
        let maxlen: number = 0;
        for (let i = 0; i < array.length; i++) {
            const element = array[i];
            if (element.length>maxlen) 
                maxlen = element.length;
        }
        return maxlen;
    }
    static getParentofNthChild(array: any[][], n: number){
        let untilnow: number = 0;
        for (let i = 0; i < array.length; i++) {
            const element = array[i];
            if (n<=(untilnow+element.length-1) && n>=untilnow) {
                return [i,n-(untilnow+1)];
            }
            untilnow+=element.length;
        }
        return [0,0];
    }
}
export default ArrayTools;