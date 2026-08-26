import { execFileSync } from "node:child_process";
import { resolve } from "node:path";

const root=resolve(import.meta.dirname,"..");
const cli=resolve(root,"node_modules/@capacitor/cli/bin/capacitor");
const shim=resolve(root,"scripts/windows-userinfo-shim.cjs");
for(const app of ["customer","rider"]){
    execFileSync(process.execPath,["--require",shim,cli,"sync","android"],{cwd:resolve(root,"mobile",app),stdio:"inherit"});
}
