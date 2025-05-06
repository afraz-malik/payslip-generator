import db from '@/lib/db';

export async function POST(req: { json: () => PromiseLike<{ payslips: any; }> | { payslips: any; }; }) {
  const { payslips } = await req.json();

  const insert = db.prepare('INSERT INTO payslips (data) VALUES (?)');
  const info = insert.run(JSON.stringify(payslips));

  return Response.json({ status: 'saved', id: info.lastInsertRowid });
}

export async function GET() {
  const rows = db.prepare('SELECT * FROM payslips').all();
  return Response.json(rows.map((row: { id: any; data: string; }) => ({
    id: row.id,
    payslips: JSON.parse(row.data),
  })));
}
