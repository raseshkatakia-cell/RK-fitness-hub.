// RK Fitness App logic and splash handling

document.addEventListener('DOMContentLoaded', function() {
  // Initialize tabs
  document.querySelectorAll('.tab').forEach(btn=>{
    btn.addEventListener('click', ()=>{ /* handled by inline onclick */ });
  });

  // Auto-remove splash after load
  window.addEventListener('load', ()=>{
    setTimeout(()=> {
      const splash = document.getElementById('splash-screen');
      if (splash) splash.remove();
    }, 2000);
  });

  // show first tab
  openTab('bmi');
});

// Tab navigation
function openTab(id){
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c=>{c.classList.remove('active'); c.hidden=true});
  // activate button
  const btn = Array.from(document.querySelectorAll('.tab')).find(b=> b.getAttribute('onclick')?.includes("'" + id + "'"));
  if(btn) btn.classList.add('active');
  const el = document.getElementById(id);
  if(el){ el.classList.add('active'); el.hidden=false; }
}

// Calculators

function calculateBMI(){
  const w = parseFloat(document.getElementById('bmiWeight').value);
  const hcm = parseFloat(document.getElementById('bmiHeight').value);
  if(!w || !hcm){ alert('Enter weight and height'); return; }
  const h = hcm/100;
  const bmi = w / (h*h);
  let status = '';
  if(bmi < 18.5) status = 'Underweight';
  else if(bmi < 25) status = 'Normal';
  else if(bmi < 30) status = 'Overweight';
  else status = 'Obese';
  document.getElementById('bmiResult').innerText = `BMI: ${bmi.toFixed(1)} (${status})`;
}

function calculateBMR(){
  const w = parseFloat(document.getElementById('bmrWeight').value);
  const h = parseFloat(document.getElementById('bmrHeight').value);
  const a = parseFloat(document.getElementById('bmrAge').value);
  const g = document.getElementById('bmrGender').value;
  if(!w || !h || !a){ alert('Enter weight, height and age'); return; }
  // Mifflin-St Jeor
  const s = g === 'male' ? 5 : -161;
  const bmr = 10*w + 6.25*h - 5*a + s;
  document.getElementById('bmrResult').innerText = `BMR: ${Math.round(bmr)} kcal/day`;
}

function calculateBodyFat(){
  const gender = document.getElementById('bfGender').value;
  const height = parseFloat(document.getElementById('bfHeight').value);
  const neck = parseFloat(document.getElementById('bfNeck').value);
  const waist = parseFloat(document.getElementById('bfWaist').value);
  const hip = parseFloat(document.getElementById('bfHip').value);
  if(!height || !neck || !waist){ alert('Enter height, neck and waist'); return; }
  let bf = 0;
  if(gender === 'male'){
    bf = 495 / (1.0324 - 0.19077*Math.log10(waist - neck) + 0.15456*Math.log10(height)) - 450;
  } else {
    if(!hip){ alert('Enter hip measurement for females'); return; }
    bf = 495 / (1.29579 - 0.35004*Math.log10(waist + hip - neck) + 0.22100*Math.log10(height)) - 450;
  }
  document.getElementById('bfResult').innerText = `Body Fat: ${bf.toFixed(1)}%`;
}

function calculateIdealWeight(){
  const gender = document.getElementById('iwGender').value;
  const height = parseFloat(document.getElementById('iwHeight').value);
  if(!height){ alert('Enter height'); return; }
  // Devine formula uses inches
  const inches = height / 2.54;
  const base = 60; // inches
  const ideal = gender === 'male' ? 50 + 2.3*(inches - base) : 45.5 + 2.3*(inches - base);
  document.getElementById('iwResult').innerText = `Ideal weight: ${ideal.toFixed(1)} kg`;
}

function calculateWHR(){
  const waist = parseFloat(document.getElementById('whrWaist').value);
  const hip = parseFloat(document.getElementById('whrHip').value);
  if(!waist || !hip){ alert('Enter waist and hip'); return; }
  const whr = waist / hip;
  document.getElementById('whrResult').innerText = `WHR: ${whr.toFixed(2)}`;
}

// share
function shareApp(){
  if(navigator.share){
    navigator.share({title:'RK Fitness App',text:'Check RK Fitness App — free fitness calculators',url:location.href});
  } else {
    navigator.clipboard.writeText(location.href).then(()=>alert('Link copied to clipboard'));
  }
}

// Register service worker
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('sw.js').catch(()=>{ /* ignore */ });
}
