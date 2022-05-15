// Current Height  [1][2][3][4][5][6][ 7][ 8][ 9][10][11][12][13]
// Next Diardi     
// Current Diardi  [X][X][X][√][X][X][ X][ √][ X][ X][ X][ √][ X]
// Prev Diardi     [X][X][X][X][√][X][ X][ X][ √][ X][ X][ X][ √]
// Panthera
// (P) Last Height [1][2][3][3][5][6][ 7][ 7][ 9][10][11][11][13]
// (P) Next Height [2][3][5][5][6][7][ 9][ 9][10][11][13][13][14]
// (P) Diffes      [1][1][2][2][1][1][ 2][ 2][ 1][ 1][ 2][ 2][ 1]
//  Felidea
// (F) Last Height [0][0][0][4][4][4][ 4][ 8][ 8][ 8][ 8][12][12]
// (F) Next Height [4][4][4][8][8][8][ 8][12][12][12][12][16][16]
// (F) Diffes      [4][4][4][8][4][4][ 4][ 4][ 4][ 4][ 4][ 4][ 4]

let current = Array.from(Array(18).keys());
current.push(current.length);
current.shift();
const fn = {
    next_diardi : c => ((c+1) % 4) === 0,
    curr_diardi : c => (c % 4) === 0,
    prev_diardi : c => ((c-1) % 4) === 0,
};
const expected = [
    "[X][X][√][X][X][X][√][X][X][X][√][X][X][X][√][X][X][X]",
    "[X][X][X][√][X][X][X][√][X][X][X][√][X][X][X][√][X][X]",
    "[√][X][X][X][√][X][X][X][√][X][X][X][√][X][X][X][√][X]",
];

const tests = [
    ["Next Diardi", () =>  {
        const result = current.map(fn.next_diardi);
        let output = [];
        for(let i = 0; i < result.length;i++) {
            output.push(result[i] ? "[√]": "[X]");
        }
        console.log(output.join("") === expected[0] ? "Success" : "Fail");
    }],
    ["Curr Diardi", () =>  {  
        const result = current.map(fn.curr_diardi);
        let output = [];
        for(let i = 0; i < result.length;i++) {
            output.push(result[i] ? "[√]": "[X]");
        }
        console.log(output.join("") === expected[1] ? "Success" : "Fail");
    }],
    ["Prev Diardi", () =>  {  
        const result = current.map(fn.prev_diardi);
        let output = [];
        for(let i = 0; i < result.length;i++) {
            output.push(result[i] ? "[√]": "[X]");
        }
        console.log(output.join("") === expected[2] ? "Success" : "Fail");
    }],
    ["Height Test", () =>  {
        const pl = current.map(r => {
            return r%4 === 0 ? r-1 : r;
        });

        const pn = [2,3,5,5,6,7,9,9,10,11,13,13,14,15,17,17,18,19];
        const pd = [1,1,2,2,1,1,2,2,1,1,2,2,1,1,2,2,1,1];
        
        const dl = current.map(r => {
            return r%4 === 0 ? r : (r-(r%4));
        });
        const dn = dl.map(r => {
            return r + 4;
        });;
        const dd = Array.from(Array(18).keys()).map(i => 4);

        const pnt = [];
        const dnt = [];
        const plt = [];
        const dlt = [];
        const pdt = [];
        const ddt = [];
        for(let i = 0; i < current.length;i++) {
            const current_height = current[i];
            let last_height = current_height;
            let next_height = current_height+1;
            const current_is_diardi = fn.curr_diardi(current_height);
            const next_diardi_block = fn.next_diardi(current_height);
            if(current_is_diardi) { // Current is diardi
                --last_height;
            } else if(next_diardi_block) { // Next is diardi
                next_height = current_height+2;
            }
            pnt.push(next_height);
            plt.push(last_height);
            pdt.push(next_height - last_height);
            console.log(current_height + (current_height !== last_height ? " New Top Hash" : " Old Top Hash"));
        }
        for(let i = 0; i < current.length;i++) {
            const current_height = current[i];
            let last_height = current_height;
            let next_height = current_height+1;
            const current_is_diardi = fn.curr_diardi(current_height);
            const next_diardi_block = fn.next_diardi(current_height);
            const mod = current_height%4;
            last_height = current_height - mod;
            next_height = last_height+4;
            dnt.push(next_height);
            dlt.push(last_height);
            ddt.push(next_height - last_height);
        }
        // console.log(dd,pd);
        // return;
        console.log("PNH : " + (pn.join('') === pnt.join('') ? "Success" : "Fail"));
        console.log("DNH : " + (dn.join('') === dnt.join('') ? "Success" : "Fail"));
        console.log("PLH : " + (pl.join('') === plt.join('') ? "Success" : "Fail"));
        console.log("DLH : " + (dl.join('') === dlt.join('') ? "Success" : "Fail"));
        console.log("PD : " + (pd.join('') === pdt.join('') ? "Success" : "Fail"));
        console.log("DD : " + (dd.join('') === ddt.join('') ? "Success" : "Fail"));

    }],
];


tests.map(o => {
    console.log(o[0]);
    o[1]();
    console.log("\n");
})