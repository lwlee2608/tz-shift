export interface TimezoneInfo {
  id: string;
  label: string;
  city: string;
  iana: string;
  aliases?: string[];
}

export const TIMEZONE_DATABASE: TimezoneInfo[] = [
  { id: 'utc', label: 'UTC', city: 'UTC', iana: 'UTC' },
  { id: 'us-pacific', label: 'PT', city: 'Los Angeles', iana: 'America/Los_Angeles', aliases: ['San Francisco', 'Seattle', 'Portland', 'San Jose', 'San Diego', 'Las Vegas'] },
  { id: 'us-mountain', label: 'MT', city: 'Denver', iana: 'America/Denver', aliases: ['Phoenix', 'Salt Lake City', 'Boise'] },
  { id: 'us-central', label: 'CT', city: 'Chicago', iana: 'America/Chicago', aliases: ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Minneapolis'] },
  { id: 'us-eastern', label: 'ET', city: 'New York', iana: 'America/New_York', aliases: ['Boston', 'Washington DC', 'Miami', 'Atlanta', 'Philadelphia', 'Detroit'] },
  { id: 'us-hawaii', label: 'HT', city: 'Honolulu', iana: 'Pacific/Honolulu' },
  { id: 'us-alaska', label: 'AKT', city: 'Anchorage', iana: 'America/Anchorage' },
  { id: 'canada-atlantic', label: 'AT', city: 'Halifax', iana: 'America/Halifax' },
  { id: 'canada-newfoundland', label: 'NT', city: 'St. Johns', iana: 'America/St_Johns' },
  { id: 'uk', label: 'GMT/BST', city: 'London', iana: 'Europe/London' },
  { id: 'ireland', label: 'IST', city: 'Dublin', iana: 'Europe/Dublin' },
  { id: 'central-europe', label: 'CET', city: 'Berlin', iana: 'Europe/Berlin' },
  { id: 'france', label: 'CET', city: 'Paris', iana: 'Europe/Paris' },
  { id: 'spain', label: 'CET', city: 'Madrid', iana: 'Europe/Madrid' },
  { id: 'italy', label: 'CET', city: 'Rome', iana: 'Europe/Rome' },
  { id: 'netherlands', label: 'CET', city: 'Amsterdam', iana: 'Europe/Amsterdam' },
  { id: 'eastern-europe', label: 'EET', city: 'Helsinki', iana: 'Europe/Helsinki' },
  { id: 'greece', label: 'EET', city: 'Athens', iana: 'Europe/Athens' },
  { id: 'turkey', label: 'TRT', city: 'Istanbul', iana: 'Europe/Istanbul' },
  { id: 'moscow', label: 'MSK', city: 'Moscow', iana: 'Europe/Moscow' },
  { id: 'dubai', label: 'GST', city: 'Dubai', iana: 'Asia/Dubai' },
  { id: 'india', label: 'IST', city: 'Mumbai', iana: 'Asia/Kolkata' },
  { id: 'india-delhi', label: 'IST', city: 'New Delhi', iana: 'Asia/Kolkata' },
  { id: 'india-bangalore', label: 'IST', city: 'Bangalore', iana: 'Asia/Kolkata' },
  { id: 'sri-lanka', label: 'SLST', city: 'Colombo', iana: 'Asia/Colombo' },
  { id: 'nepal', label: 'NPT', city: 'Kathmandu', iana: 'Asia/Kathmandu' },
  { id: 'bangladesh', label: 'BST', city: 'Dhaka', iana: 'Asia/Dhaka' },
  { id: 'myanmar', label: 'MMT', city: 'Yangon', iana: 'Asia/Yangon' },
  { id: 'thailand', label: 'ICT', city: 'Bangkok', iana: 'Asia/Bangkok' },
  { id: 'vietnam', label: 'ICT', city: 'Ho Chi Minh', iana: 'Asia/Ho_Chi_Minh' },
  { id: 'malaysia', label: 'MYT', city: 'Kuala Lumpur', iana: 'Asia/Kuala_Lumpur' },
  { id: 'singapore', label: 'SGT', city: 'Singapore', iana: 'Asia/Singapore' },
  { id: 'china', label: 'CST', city: 'Shanghai', iana: 'Asia/Shanghai' },
  { id: 'china-beijing', label: 'CST', city: 'Beijing', iana: 'Asia/Shanghai' },
  { id: 'hong-kong', label: 'HKT', city: 'Hong Kong', iana: 'Asia/Hong_Kong' },
  { id: 'taiwan', label: 'CST', city: 'Taipei', iana: 'Asia/Taipei' },
  { id: 'philippines', label: 'PHT', city: 'Manila', iana: 'Asia/Manila' },
  { id: 'korea', label: 'KST', city: 'Seoul', iana: 'Asia/Seoul' },
  { id: 'japan', label: 'JST', city: 'Tokyo', iana: 'Asia/Tokyo' },
  { id: 'australia-west', label: 'AWST', city: 'Perth', iana: 'Australia/Perth' },
  { id: 'australia-central', label: 'ACST', city: 'Adelaide', iana: 'Australia/Adelaide' },
  { id: 'australia-east', label: 'AEST', city: 'Sydney', iana: 'Australia/Sydney' },
  { id: 'australia-melbourne', label: 'AEST', city: 'Melbourne', iana: 'Australia/Melbourne' },
  { id: 'australia-brisbane', label: 'AEST', city: 'Brisbane', iana: 'Australia/Brisbane' },
  { id: 'new-zealand', label: 'NZST', city: 'Auckland', iana: 'Pacific/Auckland' },
  { id: 'fiji', label: 'FJT', city: 'Suva', iana: 'Pacific/Fiji' },
  { id: 'brazil-sao-paulo', label: 'BRT', city: 'Sao Paulo', iana: 'America/Sao_Paulo' },
  { id: 'argentina', label: 'ART', city: 'Buenos Aires', iana: 'America/Argentina/Buenos_Aires' },
  { id: 'chile', label: 'CLT', city: 'Santiago', iana: 'America/Santiago' },
  { id: 'colombia', label: 'COT', city: 'Bogota', iana: 'America/Bogota' },
  { id: 'mexico', label: 'CST', city: 'Mexico City', iana: 'America/Mexico_City' },
  { id: 'egypt', label: 'EET', city: 'Cairo', iana: 'Africa/Cairo' },
  { id: 'south-africa', label: 'SAST', city: 'Johannesburg', iana: 'Africa/Johannesburg' },
  { id: 'nigeria', label: 'WAT', city: 'Lagos', iana: 'Africa/Lagos' },
  { id: 'kenya', label: 'EAT', city: 'Nairobi', iana: 'Africa/Nairobi' },
  { id: 'saudi-arabia', label: 'AST', city: 'Riyadh', iana: 'Asia/Riyadh' },
  { id: 'pakistan', label: 'PKT', city: 'Karachi', iana: 'Asia/Karachi' },
  { id: 'uzbekistan', label: 'UZT', city: 'Tashkent', iana: 'Asia/Tashkent' },
  { id: 'iran', label: 'IRST', city: 'Tehran', iana: 'Asia/Tehran' },
  { id: 'israel', label: 'IST', city: 'Tel Aviv', iana: 'Asia/Jerusalem' },
  { id: 'indonesia-jakarta', label: 'WIB', city: 'Jakarta', iana: 'Asia/Jakarta' },
  { id: 'indonesia-bali', label: 'WITA', city: 'Bali', iana: 'Asia/Makassar' },
];

export function getUtcOffsetMinutes(iana: string, date: Date): number {
  const utcStr = date.toLocaleString('en-US', { timeZone: 'UTC' });
  const tzStr = date.toLocaleString('en-US', { timeZone: iana });
  const utcDate = new Date(utcStr);
  const tzDate = new Date(tzStr);
  return (tzDate.getTime() - utcDate.getTime()) / 60000;
}

export function formatGmtOffset(offsetMinutes: number): string {
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const abs = Math.abs(offsetMinutes);
  const hours = Math.floor(abs / 60);
  const mins = abs % 60;
  return mins === 0 ? `GMT ${sign}${hours}` : `GMT ${sign}${hours}:${String(mins).padStart(2, '0')}`;
}

export function getTimezoneName(iana: string, date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: iana,
    timeZoneName: 'long',
  }).formatToParts(date).find(p => p.type === 'timeZoneName')?.value ?? iana;
}
