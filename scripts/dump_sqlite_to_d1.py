import sqlite3
import os

def dump():
    db_path = 'server/database.sqlite'
    if not os.path.exists(db_path):
        print("No sqlite file found")
        return
        
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    tables = ['companies', 'brands', 'categories', 'products', 'product_variations', 'users']
    sql_statements = []

    for table in tables:
        try:
            cursor.execute(f'SELECT * FROM {table}')
            rows = cursor.fetchall()
            for row in rows:
                cols = list(row.keys())
                vals = []
                for col in cols:
                    v = row[col]
                    if v is None:
                        vals.append('NULL')
                    elif isinstance(v, (int, float)):
                        vals.append(str(v))
                    else:
                        escaped = str(v).replace("'", "''")
                        vals.append(f"'{escaped}'")
                sql_statements.append(f"INSERT OR REPLACE INTO {table} ({', '.join(cols)}) VALUES ({', '.join(vals)});\n")
        except Exception as e:
            print(f'Error table {table}: {e}')

    with open('server/database/seed.sql', 'w', encoding='utf-8') as f:
        f.writelines(sql_statements)

    print(f'Successfully dumped {len(sql_statements)} rows into server/database/seed.sql')

if __name__ == '__main__':
    dump()
