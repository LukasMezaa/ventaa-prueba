const fs = require('fs');

// Leer CSV
const csvText = fs.readFileSync('c:/Users/lukas/Downloads/CLIENTES PRUEBA.csv', 'utf-8');

// Funciones de parsing (copiadas de OwnersPanel.tsx)
function splitCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

function normalizePhone(value) {
  if (!value) return '';
  const digits = String(value).replace(/[^0-9]/g, '');
  if (digits.startsWith('56')) return `+${digits}`;
  if (digits.startsWith('9') && digits.length === 9) return `+569${digits}`;
  if (digits.length > 0 && !digits.startsWith('+')) return `+${digits}`;
  return digits || '';
}

function capitalizeFirstOnly(text) {
  const lower = text.toLowerCase();
  if (!lower) return '';
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

function formatCondominiumToRoman(text) {
  const lower = (text || '').toLowerCase();
  const romanMap = {
    '10': 'X', '9': 'IX', '8': 'VIII', '7': 'VII', '6': 'VI', '5': 'V', '4': 'IV', '3': 'III', '2': 'II', '1': 'I'
  };
  return lower.replace(/\b(10|[1-9])\b/g, (m) => romanMap[m] || m);
}

// Parsear CSV
const lines = csvText.replace(/\r\n?/g, '\n').split('\n').filter(l => l.trim().length > 0);
if (lines.length === 0) {
  console.log('CSV vacío');
  process.exit(1);
}

const [rawHeader, ...dataLines] = lines;
const header = splitCSVLine(rawHeader).map(h => h.trim().toLowerCase());

const idx = (name) => header.findIndex(h => h.includes(name));
const iName = idx('cliente');
const iPhone1 = [
  idx('telefonico 01'),
  idx('telefono 01'),
  idx('telefono 1'),
  idx('telefono')
].find(i => i !== -1) ?? -1;
const iPhone2 = [
  idx('telefonico 02'),
  idx('telefono 02'),
  idx('telefono 2')
].find(i => i !== -1) ?? -1;
const iEmail = idx('correo');
const iTower = idx('torre');
const iRut = idx('rut');
const iCondo = idx('condominio') !== -1 ? idx('condominio') : idx('condomin');
const iDepto = [
  idx('departamento'),
  idx('depart'),
  idx('depto')
].find(i => i !== -1) ?? -1;

let counter = 1;
const owners = [];

dataLines.forEach((line) => {
  const cols = splitCSVLine(line);
  const name = capitalizeFirstOnly((cols[iName] || '').trim());
  
  if (!name) return; // Saltar filas vacías
  
  const phone = normalizePhone(cols[iPhone1]);
  const altPhone = normalizePhone(cols[iPhone2]) || null;
  let email = (cols[iEmail] || '').trim().toLowerCase() || '';
  if (/condomin/i.test(email)) email = '';
  const rut = (cols[iRut] || '').trim().toLowerCase();
  const condoFromCsv = (cols[iCondo] || '').trim();
  const towerRaw = (cols[iTower] || '').trim();
  
  const hasDiscap = /discapacitado/i.test(towerRaw);
  const firstDigitMatch = towerRaw.match(/\d/);
  let towerNumber = firstDigitMatch ? firstDigitMatch[0] : '';
  if (towerNumber && !/[1-5]/.test(towerNumber)) {
    const oneToFive = towerRaw.match(/[1-5]/);
    towerNumber = oneToFive ? oneToFive[0] : '';
  }
  const tower = hasDiscap && towerNumber
    ? `torre(${towerNumber})/discapacitado`
    : (towerNumber ? `torre ${towerNumber}` : ((towerRaw || '').toLowerCase()));
  
  let deptoRaw = '';
  if (iDepto !== -1) {
    deptoRaw = (cols[iDepto] || '').trim();
  }
  if (!deptoRaw) {
    for (let j = cols.length - 1; j >= 0; j--) {
      if ((cols[j] || '').trim()) { deptoRaw = (cols[j] || '').trim(); break; }
    }
  }
  const deptoDigits = deptoRaw.replace(/[^0-9]/g, '');
  const depto = deptoDigits || deptoRaw;
  
  const nowIso = new Date().toISOString();
  owners.push({
    id: `asm2-${counter++}`,
    name,
    rut,
    phone,
    alternative_phone: altPhone,
    condominium: formatCondominiumToRoman(condoFromCsv || 'Alto San Miguel 2'),
    tower,
    municipal_number: depto,
    email,
    reception_date: nowIso,
    status: 'Activo',
    update_date: nowIso,
    warranty_years: 2,
    warranty_status: 'Activa',
    created_at: nowIso,
  });
});

// Generar output en formato TypeScript
console.log('// Propietarios importados desde CLIENTES PRUEBA.csv');
console.log('export const mockPropertyOwners: PropertyOwner[] = [');
owners.forEach((owner, index) => {
  const comma = index < owners.length - 1 ? ',' : '';
  console.log(`  {
    id: '${owner.id}',
    name: '${owner.name.replace(/'/g, "\\'")}',
    rut: '${owner.rut}',
    phone: '${owner.phone}',
    alternative_phone: ${owner.alternative_phone ? `'${owner.alternative_phone}'` : 'null'},
    condominium: '${owner.condominium}',
    tower: '${owner.tower}',
    municipal_number: '${owner.municipal_number}',
    email: '${owner.email}',
    reception_date: '${owner.reception_date}',
    status: '${owner.status}',
    update_date: '${owner.update_date}',
    warranty_years: ${owner.warranty_years},
    warranty_status: '${owner.warranty_status}',
    created_at: '${owner.created_at}',
  }${comma}`);
});
console.log('];');

