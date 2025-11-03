// Script temporal para parsear el CSV
const fs = require('fs');

const csvContent = `Cliente,RUT,N° TELEFONICO 01,N° TELEFONICO 02,CORREO,CONDOMINIO,N° TORRE,N° DEPARTAMENTO
GONZALEZ ANTIL JAVIERA SCARLETH,20.925.879-K,940840754,,GONZALEZJAVIERA1211@GMAIL.COM,CONDOMINIO 1,TORRE 1,101
RAMOS GONZALEZ RICARDO ANDRES,20.306.680-5,958109531,,RICARDOANDRES0001@GMAIL.COM,CONDOMINIO 1,TORRE 1,102
ALCANTAR COLOMA SEBASTIAN OCTAVIO,18.780.401-9,950151720,,S.ALCANTAR@HOTMAIL.ES,CONDOMINIO 1,TORRE 1,103
CACERES DEL PINO TOMAS ERNESTO,8.078.033-8,963433671,979417472,,CONDOMINIO 1,TORRE 1 / DISCAPACITADO,104
VALENZUELA PARRA BELEN ANDREA,18.388.745-9,973660982,97366084,BELENVALENZUELA.PARRA@GMAIL.COM,CONDOMINIO 1,TORRE 1 / DISCAPACITADO,105`;

// Función para parsear CSV (simplificada del código original)
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

// Leer el CSV completo
const csvPath = 'c:\\Users\\lukas\\Downloads\\CLIENTES PRUEBA.csv';
let csvText;
try {
  csvText = fs.readFileSync(csvPath, 'utf-8');
} catch (err) {
  console.error('Error al leer CSV:', err.message);
  process.exit(1);
}

const lines = csvText.replace(/\r\n?/g, '\n').split('\n').filter(l => l.trim().length > 0);
if (lines.length === 0) {
  console.error('CSV vacío');
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

for (const line of dataLines) {
  if (!line.trim()) continue;
  
  const cols = splitCSVLine(line);
  const name = capitalizeFirstOnly((cols[iName] || '').trim());
  
  // Filtrar filas sin nombre (vacías)
  if (!name) continue;
  
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
}

// Generar código TypeScript
let output = 'export const mockPropertyOwners: PropertyOwner[] = [\n';
for (const owner of owners) {
  output += `  {\n`;
  output += `    id: '${owner.id}',\n`;
  output += `    name: '${owner.name.replace(/'/g, "\\'")}',\n`;
  output += `    rut: '${owner.rut.replace(/'/g, "\\'")}',\n`;
  output += `    phone: '${owner.phone}',\n`;
  output += `    alternative_phone: ${owner.alternative_phone ? `'${owner.alternative_phone}'` : 'null'},\n`;
  output += `    condominium: '${owner.condominium.replace(/'/g, "\\'")}',\n`;
  output += `    tower: '${owner.tower.replace(/'/g, "\\'")}',\n`;
  output += `    municipal_number: '${owner.municipal_number}',\n`;
  output += `    email: '${owner.email.replace(/'/g, "\\'")}',\n`;
  output += `    reception_date: '${owner.reception_date}',\n`;
  output += `    status: '${owner.status}',\n`;
  output += `    update_date: '${owner.update_date}',\n`;
  output += `    warranty_years: ${owner.warranty_years},\n`;
  output += `    warranty_status: '${owner.warranty_status}',\n`;
  output += `    created_at: '${owner.created_at}',\n`;
  output += `  },\n`;
}
output += '];\n';

console.log(output);
console.error(`\nTotal propietarios parseados: ${owners.length}`);

