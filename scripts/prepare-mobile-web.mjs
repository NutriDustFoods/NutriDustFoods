import { cpSync, existsSync, mkdirSync, rmSync, copyFileSync } from "node:fs";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";

const root=resolve(import.meta.dirname,"..");
const vite=resolve(root,"node_modules/vite/bin/vite.js");
execFileSync(process.execPath,[vite,"build","--mode",process.env.MOBILE_BUILD_MODE||"mobile"],{cwd:root,stdio:"inherit",env:process.env});

const source=resolve(root,"dist"),customer=resolve(root,"dist-customer"),rider=resolve(root,"dist-rider"),admin=resolve(root,"dist-admin");
for(const target of [customer,rider,admin]){rmSync(target,{recursive:true,force:true});mkdirSync(target,{recursive:true});cpSync(source,target,{recursive:true});}
for(const file of ["admin.html","rider.html"])rmSync(resolve(customer,file),{force:true});
copyFileSync(resolve(rider,"rider.html"),resolve(rider,"index.html"));
for(const file of ["admin.html","rider.html"])rmSync(resolve(rider,file),{force:true});
copyFileSync(resolve(admin,"admin.html"),resolve(admin,"index.html"));
for(const file of ["admin.html","rider.html"])rmSync(resolve(admin,file),{force:true});
if(!existsSync(resolve(customer,"index.html"))||!existsSync(resolve(rider,"index.html"))||!existsSync(resolve(admin,"index.html")))throw new Error("Mobile web build is incomplete.");
console.log("Customer, rider, and admin mobile web bundles are ready.");
