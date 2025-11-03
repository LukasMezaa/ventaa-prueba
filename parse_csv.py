#!/usr/bin/env python3
import csv
import sys
import re
from datetime import datetime

def normalize_phone(value):
    if not value:
        return ''
    digits = re.sub(r'[^0-9]', '', str(value))
    if digits.startswith('56'):
        return f'+{digits}'
    if digits.startswith('9') and len(digits) == 9:
        return f'+569{digits}'
    if digits and not digits.startswith('+'):
        return f'+{digits}'
    return digits or ''

def capitalize_first_only(text):
    if not text:
        return ''
    lower = text.lower()
    return lower[0].upper() + lower[1:] if lower else ''

def format_condominium_to_roman(text):
    if not text:
        return ''
    lower = text.lower()
    roman_map = {
        '10': 'X', '9': 'IX', '8': 'VIII', '7': 'VII', '6': 'VI',
        '5': 'V', '4': 'IV', '3': 'III', '2': 'II', '1': 'I'
    }
    for num, roman in roman_map.items():
        lower = re.sub(rf'\b{num}\b', roman, lower)
    return lower

def format_tower(tower_raw):
    if not tower_raw:
        return ''
    tower_raw = tower_raw.strip()
    has_discap = 'discapacitado' in tower_raw.lower()
    
    first_digit_match = re.search(r'\d', tower_raw)
    tower_number = first_digit_match.group() if first_digit_match else ''
    
    if tower_number and not re.match(r'[1-5]', tower_number):
        one_to_five = re.search(r'[1-5]', tower_raw)
        tower_number = one_to_five.group() if one_to_five else ''
    
    if has_discap and tower_number:
        return f'torre({tower_number})/discapacitado'
    elif tower_number:
        return f'torre {tower_number}'
    else:
        return tower_raw.lower()

def parse_depto(value):
    if not value:
        return ''
    digits = re.sub(r'[^0-9]', '', str(value))
    return digits if digits else str(value).strip()

csv_path = r'c:\Users\lukas\Downloads\CLIENTES PRUEBA.csv'

owners = []
counter = 1
now_iso = datetime.now().isoformat() + 'Z'

try:
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            cliente = row.get('Cliente', '') or ''
            name = capitalize_first_only(cliente.strip())
            if not name:
                continue
            
            phone = normalize_phone(row.get('N° TELEFONICO 01', '') or '')
            alt_phone_raw = row.get('N° TELEFONICO 02', '') or ''
            alt_phone = normalize_phone(alt_phone_raw) if alt_phone_raw.strip() else None
            
            email_raw = row.get('CORREO', '') or ''
            email = email_raw.strip().lower()
            if 'condomin' in email.lower():
                email = ''
            
            rut_raw = row.get('RUT', '') or ''
            rut = rut_raw.strip().lower()
            
            condo_raw = row.get('CONDOMINIO', '') or ''
            condo = format_condominium_to_roman(condo_raw.strip() or 'Alto San Miguel 2')
            
            tower_raw = row.get('N° TORRE', '') or ''
            tower = format_tower(tower_raw)
            
            depto_raw = row.get('N° DEPARTAMENTO', '') or ''
            depto = parse_depto(depto_raw)
            
            owners.append({
                'id': f'asm2-{counter}',
                'name': name,
                'rut': rut,
                'phone': phone,
                'alt_phone': alt_phone,
                'condo': condo,
                'tower': tower,
                'depto': depto,
                'email': email,
            })
            counter += 1
except Exception as e:
    print(f"Error: {e}", file=sys.stderr)
    sys.exit(1)

# Generate TypeScript code
print('export const mockPropertyOwners: PropertyOwner[] = [')
for owner in owners:
    print('  {')
    print(f"    id: '{owner['id']}',")
    print(f"    name: {repr(owner['name'])},  // Escape quotes")
    print(f"    rut: '{owner['rut'].replace(chr(39), chr(39)+chr(39))}',")
    print(f"    phone: '{owner['phone']}',")
    print(f"    alternative_phone: {repr(owner['alt_phone']) if owner['alt_phone'] else 'null'},")
    print(f"    condominium: {repr(owner['condo'])},  // Escape quotes")
    print(f"    tower: {repr(owner['tower'])},  // Escape quotes")
    print(f"    municipal_number: '{owner['depto']}',")
    print(f"    email: {repr(owner['email'])},  // Escape quotes")
    print(f"    reception_date: '{now_iso}',")
    print(f"    status: 'Activo',")
    print(f"    update_date: '{now_iso}',")
    print(f"    warranty_years: 2,")
    print(f"    warranty_status: 'Activa',")
    print(f"    created_at: '{now_iso}',")
    print('  },')
print('];')
print(f'\n// Total: {len(owners)} propietarios', file=sys.stderr)

