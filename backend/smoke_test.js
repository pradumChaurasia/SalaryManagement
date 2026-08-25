async function wait(ms){return new Promise(r=>setTimeout(r,ms))}
async function pollHealth(){
  for(let i=0;i<20;i++){
    try{
      const res = await fetch('http://localhost:3000/health');
      if(res.ok) return true;
    }catch(e){}
    await wait(500);
  }
  throw new Error('health check failed')
}

async function run(){
  await pollHealth();
  console.log('API healthy, fetching one employee...')
  const empRes = await fetch('http://localhost:3000/employees?limit=1');
  const empJson = await empRes.json().catch(()=>null);
  console.log('employees response:', empJson)
  const e = empJson && empJson.items && empJson.items[0]
  if(!e) return console.error('no employee found')
  console.log('found employee', e.id)
  const postBody = { employeeId: e.id, annualBase: '50000.00', currency: 'USD', effectiveFrom: new Date().toISOString(), notes: 'smoke-test' }
  const postRes = await fetch('http://localhost:3000/compensations',{
    method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(postBody)
  })
  const postJson = await postRes.json().catch(()=>null)
  console.log('create compensation response:', postJson)
}

run().catch(err=>{ console.error(err); process.exitCode=1 })
