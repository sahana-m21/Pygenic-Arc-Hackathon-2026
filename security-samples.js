/* Synthetic datasets: four sector demos and the mentor-inspired employee scenario. */
(function(root,create){const result=create();if(typeof module==='object'&&module.exports)module.exports=result;root.PygenicSamples=result;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const sample=(company,companyKind,dbName,dbid,assetImpact=10)=>({
 company,
 resources:[
  {id:'internet',name:'Internet (assumed public entry)',kind:'entry'},
  {id:'frontend',name:companyKind+' Public Portal',kind:'service',exposure:'public',requiresAuth:false,auditLogging:true},
  {id:'archive',name:companyKind+' Public Backup Storage',kind:'storage',publicAccess:true,encryptionAtRest:false,auditLogging:false},
  {id:'webrole',name:companyKind+' Web IAM Role',kind:'iam_role',permissions:['*'],mfaEnabled:false},
  {id:'backuprole',name:companyKind+' Backup IAM Role',kind:'iam_role',permissions:['*'],mfaEnabled:true},
  {id:dbid,name:dbName,kind:'database',critical:true,impact:assetImpact,publicAccess:false,encryptionAtRest:true,auditLogging:true},
  {id:'projectB',name:'Project B Workspace',kind:'project',project:'B'},
  {id:'projectD',name:'Project D Workspace',kind:'project',project:'D'},
  {id:'emp_Darshan',name:'Darshan (assumed compromised account)',employeeName:'Darshan',kind:'employee'},
  {id:'emp_Rahul',name:'Rahul (assumed compromised account)',employeeName:'Rahul',kind:'employee'},
  {id:'emp_Meghana',name:'Meghana (assumed compromised account)',employeeName:'Meghana',kind:'employee'}
 ],
 connections:[
  {from:'internet',to:'frontend'},
  {from:'frontend',to:'webrole'},
  {from:'webrole',to:dbid},
  {from:'internet',to:'archive'},
  {from:'archive',to:'backuprole'},
  {from:'backuprole',to:dbid},
  {from:'emp_Darshan',to:'projectB',project:'B'},
  {from:'emp_Meghana',to:'projectB',project:'B'},
  {from:'emp_Rahul',to:'projectD',project:'D'},
  {from:'projectB',to:'webrole'},
  {from:'projectD',to:'backuprole'}
 ],
 employees:[
  {name:'Darshan',assigned:['A'],access:['A','B']},
  {name:'Priya',assigned:['B'],access:['B']},
  {name:'Rahul',assigned:['C'],access:['C','D']},
  {name:'Sneha',assigned:['A'],access:['A']},
  {name:'Kiran',assigned:['D'],access:['D']},
  {name:'Ananya',assigned:['B'],access:['B']},
  {name:'Rohan',assigned:['C'],access:['C']},
  {name:'Meghana',assigned:['D'],access:['D','B']},
  {name:'Varun',assigned:['A'],access:['A']},
  {name:'Kavya',assigned:['B'],access:['B']}
 ]
 });
 const company=sample('SecureTech Solutions (fictional)','Company','Customer Database','customers');
 const hospital=sample('MedVista Hospital (fictional)','Hospital','Patient Records Database','patients');
 // A hospital portal is authenticated; its primary public exposure is backup storage.
 hospital.resources.find(r=>r.id==='frontend').requiresAuth=true;
 const college=sample('Horizon College (fictional)','College','Student Marks Database','marks',9);
 // The marks portal has an auth gate, but exports remain in public backup storage.
 college.resources.find(r=>r.id==='frontend').requiresAuth=true;
 college.resources.find(r=>r.id==='archive').name='Unprotected Student Export Bucket';
 const banking=sample('Harbor Bank (fictional)','Banking','Transaction Database','transactions');
 // Backup storage is private; public API plus excessive staff roles are the risks.
 banking.resources.find(r=>r.id==='archive').publicAccess=false;
 banking.resources.find(r=>r.id==='archive').encryptionAtRest=true;
 banking.resources.find(r=>r.id==='archive').name='Private Banking Backup';
 const shopping=sample('NovaCart Store (fictional)','Shopping','Customer Orders Database','orders',9);
 shopping.resources.find(r=>r.id==='frontend').name='Public Partner Shopping API';
 shopping.resources.find(r=>r.id==='archive').name='Public Customer Export Bucket';
 return {Company:company,Hospital:hospital,College:college,Banking:banking,Shopping:shopping};
});
